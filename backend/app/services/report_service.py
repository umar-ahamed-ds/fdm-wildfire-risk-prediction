import io
from datetime import datetime, timezone
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

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

def generate_pdf_report(prediction_data: dict) -> io.BytesIO:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = styles['Heading1']
    title_style.alignment = 1 # Center
    
    heading_style = styles['Heading2']
    heading_style.textColor = colors.HexColor("#2c3e50")
    
    normal_style = styles['Normal']
    normal_style.fontSize = 10
    normal_style.leading = 14
    
    elements = []
    
    # Title
    elements.append(Paragraph("WILDFIRE RISK ASSESSMENT REPORT", title_style))
    elements.append(Spacer(1, 20))
    
    # 1. Assessment Information
    elements.append(Paragraph("1. Assessment Information", heading_style))
    info_data = [
        ["Prediction ID:", prediction_data.get("prediction_id", "N/A")],
        ["Assessment Date:", prediction_data.get("assessment_date", "N/A")],
        ["Generated Date:", datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")],
        ["Location:", f"{prediction_data['location']['latitude']}, {prediction_data['location']['longitude']}"]
    ]
    info_table = Table(info_data, colWidths=[150, 300])
    info_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 15))
    
    # 2. Prediction Result
    elements.append(Paragraph("2. Prediction Result", heading_style))
    pred = prediction_data.get("prediction", {})
    risk_level = pred.get('risk_level', 'Unknown')
    
    result_data = [
        ["Wildfire Risk:", risk_level],
        ["Probability:", f"{pred.get('percentage', 0)}%"],
        ["Model:", prediction_data.get("model", {}).get("name", "XGBoost")]
    ]
    result_table = Table(result_data, colWidths=[150, 300])
    
    risk_color = colors.green
    if risk_level == "High Risk": risk_color = colors.red
    elif risk_level == "Medium Risk": risk_color = colors.orange
    
    result_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (1,0), (1,0), risk_color),
        ('FONTNAME', (1,0), (1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
    ]))
    elements.append(result_table)
    elements.append(Spacer(1, 15))
    
    # 3. Environmental Conditions
    elements.append(Paragraph("3. Environmental Conditions", heading_style))
    features = prediction_data.get("input_features", {})
    
    env_data = [
        # Location
        ["Location:", f"Lat: {features.get('latitude')}, Lon: {features.get('longitude')}"],
        # Weather
        ["Weather:", f"Precipitation: {features.get('precipitation')} mm\n"
                    f"Rel. Humidity (Min/Max): {features.get('relative_humidity_min')}% / {features.get('relative_humidity_max')}%\n"
                    f"Specific Humidity: {features.get('specific_humidity')}\n"
                    f"Solar Radiation: {features.get('solar_radiation')} W/m2\n"
                    f"Temperature (Min/Max): {features.get('temperature_min')}C / {features.get('temperature_max')}C\n"
                    f"Wind Speed: {features.get('wind_speed')} m/s"],
        # Fire/Fuel
        ["Fire / Fuel:", f"Burning Index: {features.get('burning_index')}\n"
                        f"Fuel Moisture (100h/1000h): {features.get('fuel_moisture_100hr')}% / {features.get('fuel_moisture_1000hr')}%\n"
                        f"Energy Release Comp.: {features.get('energy_release_component')}"],
        # Atmospheric
        ["Atmospheric:", f"Ref. Evapotranspiration: {features.get('reference_evapotranspiration')}\n"
                        f"Pot. Evapotranspiration: {features.get('potential_evapotranspiration')}\n"
                        f"Vapor Pressure Deficit: {features.get('vapor_pressure_deficit')}"],
        # Date
        ["Derived Date:", f"Year: {features.get('year')}, Month: {features.get('month')}, Day: {features.get('day_of_year')}"]
    ]
    
    env_table = Table(env_data, colWidths=[100, 350])
    env_table.setStyle(TableStyle([
        ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    elements.append(env_table)
    elements.append(Spacer(1, 15))
    
    # 4. Risk Interpretation
    elements.append(Paragraph("4. Risk Interpretation", heading_style))
    elements.append(Paragraph(get_risk_interpretation(risk_level), normal_style))
    elements.append(Spacer(1, 15))
    
    # 5. Recommended Actions
    elements.append(Paragraph("5. Recommended Actions", heading_style))
    actions = get_risk_actions(risk_level)
    for action in actions:
        elements.append(Paragraph(f"• {action}", normal_style))
    elements.append(Spacer(1, 20))
    
    # 6. Disclaimer
    disclaimer_style = ParagraphStyle('Disclaimer', parent=styles['Normal'], fontSize=8, textColor=colors.gray, fontName="Helvetica-Oblique")
    elements.append(Paragraph("Disclaimer: This prediction is a machine-learning estimate based on the supplied conditions and should not replace official emergency warnings or professional risk assessments.", disclaimer_style))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
