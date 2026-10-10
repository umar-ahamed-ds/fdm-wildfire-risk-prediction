import httpx
from fastapi import APIRouter, HTTPException, Query
from app.core.config import settings

router = APIRouter(prefix="/locations", tags=["locations"])

@router.get("/search")
async def search_locations(q: str = Query(..., min_length=2)):
    """
    Search for worldwide locations using Geoapify Autocomplete API.
    This acts as a secure proxy so the frontend doesn't need the API key.
    """
    if not settings.GEOAPIFY_API_KEY:
        raise HTTPException(
            status_code=500, 
            detail="GEOAPIFY_API_KEY is not configured in the backend environment."
        )

    url = "https://api.geoapify.com/v1/geocode/search"
    params = {
        "text": q,
        "apiKey": settings.GEOAPIFY_API_KEY,
        "limit": 5,
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            # Format results for the frontend
            results = []
            # Geoapify standard geocoding response returns a GeoJSON FeatureCollection
            features = data.get("features", [])
            for feature in features:
                props = feature.get("properties", {})
                if "lat" in props and "lon" in props:
                    formatted_name = props.get("formatted", props.get("address_line1", "Unknown Location"))
                    results.append({
                        "name": props.get("name") or props.get("city") or formatted_name,
                        "formatted": formatted_name,
                        "latitude": props["lat"],
                        "longitude": props["lon"],
                        "country": props.get("country"),
                        "state": props.get("state")
                    })
            
            # Fallback for format=json if needed
            if not results and "results" in data:
                for item in data.get("results", []):
                    if "lat" in item and "lon" in item:
                        formatted_name = item.get("formatted", item.get("address_line1", "Unknown Location"))
                        results.append({
                            "name": item.get("name") or item.get("city") or formatted_name,
                            "formatted": formatted_name,
                            "latitude": item["lat"],
                            "longitude": item["lon"],
                            "country": item.get("country"),
                            "state": item.get("state")
                        })

            return {"results": results}
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch locations from Geoapify: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred during location search.")
