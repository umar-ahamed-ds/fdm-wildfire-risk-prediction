import io
from datetime import datetime, timezone
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus.flowables import KeepTogether, Flowable

def get_risk_actions(risk_level: str) -> list[str]:
    if risk_level == "High Risk":
        return [
            "Increase monitoring of the assessed area.",
            "Ensure emergency response resources are ready.",
            "Avoid unnecessary ignition sources.",
            "Keep access routes clear.",
            "Follow official fire and disaster-management warnings.",
            "Follow official evacuation instructions if issued.",
            "Do not attempt to fight an established wildfire yourself."
        ]
    elif risk_level == "Medium Risk":
        return [
            "Increase monitoring.",
            "Avoid unnecessary outdoor burning.",
            "Review preparedness.",
            "Monitor official warnings."
        ]
    elif risk_level == "Low Risk":
        return [
            "Continue normal monitoring.",
            "Maintain basic preparedness."
        ]
    else:
        return [
            "Continue normal environmental monitoring."
        ]

def get_risk_interpretation(risk_level: str) -> str:
    if risk_level == "High Risk":
        return "High wildfire risk detected under the supplied conditions. Increase monitoring and preparedness."
    elif risk_level == "Medium Risk":
        return "Moderate wildfire risk detected. Increased awareness and monitoring are recommended."
    elif risk_level == "Low Risk":
        return "Low wildfire risk detected under the supplied conditions. Continue normal monitoring."
    else:
        return "No elevated wildfire risk detected by the model under the supplied conditions."


def get_risk_color(risk_level: str):
    if risk_level == "High Risk":
        return colors.HexColor("#c0392b")
    elif risk_level == "Medium Risk":
        return colors.HexColor("#f39c12")
    else:
        return colors.HexColor("#27ae60")

class ColoredBox(Flowable):
    def __init__(self, paragraph, border_color, bg_color):
        Flowable.__init__(self)
        self.paragraph = paragraph
        self.border_color = border_color
        self.bg_color = bg_color
        self.width = 468
        
    def wrap(self, availWidth, availHeight):
        self.width = availWidth
        return self.paragraph.wrap(availWidth - 20, availHeight - 20)

    def draw(self):
        self.canv.saveState()
        w, h = self.paragraph.wrap(self.width - 20, 1000)
        self.canv.setFillColor(self.bg_color)
        self.canv.setStrokeColor(self.border_color)
        self.canv.setLineWidth(1)
        self.canv.rect(0, 0, self.width, h + 20, fill=1, stroke=1)
        self.paragraph.drawOn(self.canv, 10, 10)
        self.canv.restoreState()


def header_footer(canvas, doc):
    canvas.saveState()
    
    # Header
    canvas.setFont('Helvetica-Bold', 10)
    canvas.setFillColor(colors.HexColor("#2c3e50"))
    canvas.drawString(doc.leftMargin, doc.pagesize[1] - 40, "Wildfire Risk Dashboard")
    canvas.setFont('Helvetica', 8)
    canvas.drawString(doc.leftMargin, doc.pagesize[1] - 52, "Environmental Monitoring System")
    
    # Header Line
    canvas.setStrokeColor(colors.HexColor("#bdc3c7"))
    canvas.setLineWidth(0.5)
    canvas.line(doc.leftMargin, doc.pagesize[1] - 60, doc.pagesize[0] - doc.rightMargin, doc.pagesize[1] - 60)
    
    # Footer Line
    canvas.line(doc.leftMargin, 50, doc.pagesize[0] - doc.rightMargin, 50)
    
    # Footer Text
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.HexColor("#7f8c8d"))
    canvas.drawString(doc.leftMargin, 35, "Wildfire Risk Dashboard | FDM Mini Project © 2026")
    
    page_num = f"Page {doc.page}"
    canvas.drawRightString(doc.pagesize[0] - doc.rightMargin, 35, page_num)
    
    canvas.restoreState()


def generate_pdf_report(prediction_data: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, 
        pagesize=letter, 
        rightMargin=72, 
        leftMargin=72, 
        topMargin=80, 
        bottomMargin=60
    )
    
    styles = getSampleStyleSheet()
    
    navy_color = colors.HexColor("#2c3e50")
    charcoal_color = colors.HexColor("#34495e")
    
    title_style = ParagraphStyle(
        'MainTitle', 
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=navy_color,
        alignment=0,
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        textColor=charcoal_color,
        spaceAfter=30
    )
    
    heading_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=14,
        textColor=navy_color,
        spaceBefore=20,
        spaceAfter=12
    )
    
    sub_heading_style = ParagraphStyle(
        'SubHeading',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=charcoal_color,
        spaceBefore=12,
        spaceAfter=6
    )
    
    normal_style = ParagraphStyle(
        'NormalText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        textColor=charcoal_color,
        leading=14
    )
    
    elements = []
    
    # TITLE
    elements.append(Paragraph("WILDFIRE RISK<br/>ASSESSMENT REPORT", title_style))
    elements.append(Paragraph("Machine-Learning-Based Environmental Risk Assessment", subtitle_style))
    
    # 1. ASSESSMENT INFORMATION
    elements.append(Paragraph("1. Assessment Information", heading_style))
    
    loc_data = prediction_data.get("location", {})
    location_display_name = loc_data.get("name")
    lat_lon = f"{loc_data.get('latitude', 'N/A')}, {loc_data.get('longitude', 'N/A')}"
    
    generated_date = datetime.now(timezone.utc).strftime("%d %B %Y, %H:%M UTC")
    
    if location_display_name:
        loc_row_1 = ["Assessment Location:", location_display_name]
        loc_row_2 = ["Coordinates:", lat_lon]
        info_data = [
            ["Prediction ID:", prediction_data.get("prediction_id", "N/A")],
            ["Assessment Date:", prediction_data.get("assessment_date", "N/A")],
            ["Generated Date:", generated_date],
            loc_row_1,
            loc_row_2,
            ["Model:", prediction_data.get("model", {}).get("name", "XGBoost")]
        ]
    else:
        info_data = [
            ["Prediction ID:", prediction_data.get("prediction_id", "N/A")],
            ["Assessment Date:", prediction_data.get("assessment_date", "N/A")],
            ["Generated Date:", generated_date],
            ["Location:", lat_lon],
            ["Model:", prediction_data.get("model", {}).get("name", "XGBoost")]
        ]
        
    info_table = Table(info_data, colWidths=[130, 330])
    info_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
        ('TEXTCOLOR', (0,0), (-1,-1), charcoal_color),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('LINEBELOW', (0,0), (-1,-2), 0.5, colors.HexColor("#ecf0f1")),
    ]))
    elements.append(info_table)
    
    # 2. PREDICTION RESULT
    elements.append(Paragraph("2. Prediction Result", heading_style))
    
    pred = prediction_data.get("prediction", {})
    risk_level = pred.get('risk_level', 'Unknown')
    percentage = f"{pred.get('percentage', 0):.1f}%"
    model_name = prediction_data.get("model", {}).get("name", "XGBoost")
    
    risk_color = get_risk_color(risk_level)
    
    # Result Box
    result_box_style = TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8f9fa")),
        ('BOX', (0,0), (-1,-1), 1.5, risk_color),
        ('TOPPADDING', (0,0), (-1,-1), 15),
        ('BOTTOMPADDING', (0,0), (-1,-1), 15),
    ])
    
    result_content = [
        [Paragraph("<para align=center><b>WILDFIRE RISK</b></para>", ParagraphStyle('R1', fontName='Helvetica-Bold', fontSize=14, textColor=navy_color))],
        [Spacer(1, 10)],
        [Paragraph(f"<para align=center><b>{percentage}</b></para>", ParagraphStyle('R2', fontName='Helvetica-Bold', fontSize=28, textColor=risk_color))],
        [Spacer(1, 5)],
        [Paragraph(f"<para align=center><b>{risk_level.upper()}</b></para>", ParagraphStyle('R3', fontName='Helvetica-Bold', fontSize=14, textColor=risk_color))],
        [Spacer(1, 15)],
        [Paragraph(f"<para align=center>Model: {model_name}</para>", ParagraphStyle('R4', fontName='Helvetica', fontSize=10, textColor=charcoal_color))],
    ]
    
    result_box = Table(result_content, colWidths=[460])
    result_box.setStyle(result_box_style)
    elements.append(result_box)
    
    elements.append(PageBreak())
    
    # 3. ENVIRONMENTAL CONDITIONS
    elements.append(Paragraph("3. Environmental Conditions", heading_style))
    
    features = prediction_data.get("input_features", {})
    
    # 3.1 Location
    elements.append(Paragraph("3.1 Location", sub_heading_style))
    if location_display_name:
        loc_t = Table([
            ["Location Name:", location_display_name],
            ["Latitude:", str(features.get('latitude', 'N/A'))],
            ["Longitude:", str(features.get('longitude', 'N/A'))]
        ], colWidths=[180, 280])
    else:
        loc_t = Table([
            ["Latitude:", str(features.get('latitude', 'N/A'))],
            ["Longitude:", str(features.get('longitude', 'N/A'))]
        ], colWidths=[180, 280])
    
    base_t_style = TableStyle([
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('FONTNAME', (1,0), (1,-1), 'Helvetica'),
        ('TEXTCOLOR', (0,0), (-1,-1), charcoal_color),
        ('FONTSIZE', (0,0), (-1,-1), 9),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
    ])
    loc_t.setStyle(base_t_style)
    elements.append(loc_t)
    
    # 3.2 Weather Conditions
    elements.append(Paragraph("3.2 Weather Conditions", sub_heading_style))
    w_t = Table([
        ["Precipitation:", f"{features.get('precipitation', 'N/A')} mm"],
        ["Minimum Relative Humidity:", f"{features.get('relative_humidity_min', 'N/A')} %"],
        ["Maximum Relative Humidity:", f"{features.get('relative_humidity_max', 'N/A')} %"],
        ["Specific Humidity:", str(features.get('specific_humidity', 'N/A'))],
        ["Solar Radiation:", f"{features.get('solar_radiation', 'N/A')} W/m²"],
        ["Minimum Temperature:", f"{features.get('temperature_min', 'N/A')} °C"],
        ["Maximum Temperature:", f"{features.get('temperature_max', 'N/A')} °C"],
        ["Wind Speed:", f"{features.get('wind_speed', 'N/A')} m/s"]
    ], colWidths=[180, 280])
    w_t.setStyle(base_t_style)
    elements.append(w_t)
    
    # 3.3 Fire / Fuel Conditions
    elements.append(Paragraph("3.3 Fire / Fuel Conditions", sub_heading_style))
    f_t = Table([
        ["Burning Index:", str(features.get('burning_index', 'N/A'))],
        ["Fuel Moisture 100hr:", f"{features.get('fuel_moisture_100hr', 'N/A')} %"],
        ["Fuel Moisture 1000hr:", f"{features.get('fuel_moisture_1000hr', 'N/A')} %"],
        ["Energy Release Component:", str(features.get('energy_release_component', 'N/A'))]
    ], colWidths=[180, 280])
    f_t.setStyle(base_t_style)
    elements.append(f_t)
    
    # 3.4 Atmospheric Conditions
    elements.append(Paragraph("3.4 Atmospheric Conditions", sub_heading_style))
    a_t = Table([
        ["Reference Evapotranspiration:", str(features.get('reference_evapotranspiration', 'N/A'))],
        ["Potential Evapotranspiration:", str(features.get('potential_evapotranspiration', 'N/A'))],
        ["Vapor Pressure Deficit:", f"{features.get('vapor_pressure_deficit', 'N/A')} kPa"]
    ], colWidths=[180, 280])
    a_t.setStyle(base_t_style)
    elements.append(a_t)
    
    # 3.5 Derived Date Features
    elements.append(Paragraph("3.5 Derived Date Features", sub_heading_style))
    d_t = Table([
        ["Year:", str(features.get('year', 'N/A'))],
        ["Month:", str(features.get('month', 'N/A'))],
        ["Day of Year:", str(features.get('day_of_year', 'N/A'))]
    ], colWidths=[180, 280])
    d_t.setStyle(base_t_style)
    elements.append(d_t)
    
    # 4. Risk Interpretation
    elements.append(Spacer(1, 15))
    elements.append(KeepTogether([
        Paragraph("4. Risk Interpretation", heading_style),
        ColoredBox(
            Paragraph(get_risk_interpretation(risk_level), normal_style),
            border_color=risk_color,
            bg_color=colors.HexColor("#fdfefe" if risk_level != "High Risk" else "#fff5f5")
        )
    ]))
    
    # 5. Recommended Actions
    elements.append(Spacer(1, 15))
    actions_elements = [Paragraph("5. Recommended Actions", heading_style)]
    
    actions = get_risk_actions(risk_level)
    for action in actions:
        actions_elements.append(Paragraph(f"<b>✓</b>  {action}", normal_style))
        actions_elements.append(Spacer(1, 4))
        
    elements.append(KeepTogether(actions_elements))
    
    elements.append(Spacer(1, 30))
    
    # 6. Disclaimer
    disclaimer_style = ParagraphStyle(
        'Disclaimer', 
        parent=styles['Normal'], 
        fontSize=8, 
        textColor=colors.HexColor("#7f8c8d"), 
        fontName="Helvetica-Oblique",
        leading=10
    )
    elements.append(Paragraph("<b>Disclaimer:</b> This prediction is a machine-learning estimate based on the supplied environmental and geographical conditions. It should not replace official emergency warnings, professional wildfire assessments, or emergency-management instructions.", disclaimer_style))
    
    doc.build(elements, onFirstPage=header_footer, onLaterPages=header_footer)
    buffer.seek(0)
    return buffer
