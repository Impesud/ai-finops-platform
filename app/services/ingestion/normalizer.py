from typing import List, Dict
from datetime import date

def normalize(*args: List[Dict]) -> List[Dict]:
    """
    Flatten and unify raw ingestion records from multiple providers.
    Output records have common fields: date, provider, cost_usd.
    """
    unified = []
    for source in args:
        for rec in source:
            # ensure date is ISO string
            d = rec.get('date')
            if hasattr(d, 'date'):
                d = d.date().isoformat()
            unified.append({
                'date': d,
                'service': rec.get('service'),
                'cost_usd': rec.get('cost_usd'),
            })
    return unified