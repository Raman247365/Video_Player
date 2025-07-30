#!/usr/bin/env python3
"""
Setup script for ML Voice Engine
"""

from setuptools import setup, find_packages

setup(
    name="ml-voice-engine",
    version="1.0.0",
    description="ML-enhanced voice command detection for vcXvp",
    packages=find_packages(),
    install_requires=[
        "numpy>=1.21.0",
        "scikit-learn>=1.0.0",
        "flask>=2.0.0",
        "flask-cors>=3.0.0"
    ],
    python_requires=">=3.8",
    entry_points={
        'console_scripts': [
            'voice-ml-server=voice_api_server:main',
        ],
    },
)