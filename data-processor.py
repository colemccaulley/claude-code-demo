#!/usr/bin/env python3
"""
Data Processing Utility

This script demonstrates data processing capabilities including:
- Reading and parsing CSV data
- Data transformation
- Statistical analysis
- Export to multiple formats
"""

import csv
import json
from datetime import datetime
from typing import List, Dict


class DataProcessor:
    """Process and analyze data from various sources."""

    def __init__(self, data: List[Dict]):
        self.data = data

    def filter_by_value(self, key: str, value) -> List[Dict]:
        """Filter data by a specific key-value pair."""
        return [item for item in self.data if item.get(key) == value]

    def calculate_average(self, key: str) -> float:
        """Calculate average of numeric values for a given key."""
        values = [float(item.get(key, 0)) for item in self.data if item.get(key)]
        return sum(values) / len(values) if values else 0.0

    def group_by_key(self, key: str) -> Dict[str, List[Dict]]:
        """Group data by a specific key."""
        grouped = {}
        for item in self.data:
            group_key = item.get(key)
            if group_key:
                grouped.setdefault(group_key, []).append(item)
        return grouped

    def export_to_json(self, filename: str):
        """Export processed data to JSON file."""
        with open(filename, 'w') as f:
            json.dump(self.data, f, indent=2)
        print(f"Data exported to {filename}")


def main():
    """Example usage of DataProcessor."""
    # Sample data
    sample_data = [
        {"name": "Project A", "category": "Development", "hours": 120, "status": "Complete"},
        {"name": "Project B", "category": "Design", "hours": 80, "status": "In Progress"},
        {"name": "Project C", "category": "Development", "hours": 150, "status": "Complete"},
        {"name": "Project D", "category": "Testing", "hours": 60, "status": "Complete"},
    ]

    processor = DataProcessor(sample_data)

    # Demonstrate capabilities
    print("=== Data Processing Demo ===\n")

    # Filter
    completed = processor.filter_by_value("status", "Complete")
    print(f"Completed projects: {len(completed)}")

    # Calculate average
    avg_hours = processor.calculate_average("hours")
    print(f"Average hours per project: {avg_hours:.1f}")

    # Group by category
    by_category = processor.group_by_key("category")
    print(f"\nProjects by category:")
    for category, projects in by_category.items():
        print(f"  {category}: {len(projects)} project(s)")

    # Export
    processor.export_to_json("processed_data.json")


if __name__ == "__main__":
    main()
