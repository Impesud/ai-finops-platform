from datetime import date
from typing import List, Dict

class BaseIngest:
    """
    Abstract base class for cloud cost ingestion.
    """
    def fetch(self, start: date, end: date) -> List[Dict]:
        """
        Fetch raw cost records between start and end dates.
        Returns a list of dicts.
        """
        raise NotImplementedError