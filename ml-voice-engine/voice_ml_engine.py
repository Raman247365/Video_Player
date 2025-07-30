#!/usr/bin/env python3
"""
Advanced ML Voice Command Detection Engine
Improves voice command recognition using machine learning
"""

import numpy as np
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from difflib import SequenceMatcher
import re
from typing import Dict, List, Tuple, Optional

class VoiceCommandML:
    def __init__(self):
        self.commands = self._load_commands()
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 3),
            stop_words=None,
            lowercase=True,
            analyzer='word'
        )
        self.command_vectors = None
        self.command_list = []
        self._train_model()
    
    def _load_commands(self) -> Dict:
        """Load command patterns and aliases"""
        return {
            'playback': {
                'play': ['play', 'start', 'resume', 'begin'],
                'pause': ['pause', 'stop', 'halt', 'freeze'],
                'toggle': ['toggle', 'play pause', 'switch'],
                'restart': ['restart', 'start over', 'begin again', 'from beginning']
            },
            'navigation': {
                'skip_forward': ['skip forward', 'forward', 'skip ahead', 'next'],
                'skip_backward': ['skip backward', 'backward', 'go back', 'previous'],
                'jump_time': ['jump to', 'go to', 'seek to', 'move to'],
                'next_frame': ['next frame', 'frame forward', 'step forward'],
                'prev_frame': ['previous frame', 'frame backward', 'step backward']
            },
            'volume': {
                'volume_up': ['volume up', 'louder', 'increase volume', 'turn up'],
                'volume_down': ['volume down', 'quieter', 'decrease volume', 'turn down'],
                'mute': ['mute', 'silence', 'quiet', 'no sound'],
                'unmute': ['unmute', 'sound on', 'audio on'],
                'volume_set': ['volume', 'set volume to', 'volume level']
            },
            'speed': {
                'speed_up': ['speed up', 'faster', 'accelerate', 'quick'],
                'speed_down': ['slow down', 'slower', 'decelerate'],
                'normal_speed': ['normal speed', 'regular speed', 'one x'],
                'double_speed': ['double speed', 'two x', 'twice as fast'],
                'half_speed': ['half speed', 'point five x', 'slow motion']
            },
            'quality': {
                'quality_auto': ['auto quality', 'automatic quality'],
                'quality_8k': ['8k', 'eight k', 'ultra quality', 'highest quality'],
                'quality_4k': ['4k', 'four k', 'ultra hd'],
                'quality_1080p': ['1080p', 'full hd', 'high definition'],
                'quality_720p': ['720p', 'hd', 'standard hd'],
                'quality_480p': ['480p', 'standard definition', 'sd']
            },
            'display': {
                'fullscreen': ['fullscreen', 'full screen', 'maximize'],
                'exit_fullscreen': ['exit fullscreen', 'minimize', 'windowed'],
                'pip': ['picture in picture', 'pip', 'mini player'],
                'screenshot': ['screenshot', 'capture', 'take picture', 'snap']
            },
            'bookmarks': {
                'add_bookmark': ['add bookmark', 'bookmark this', 'mark this'],
                'goto_bookmark': ['go to bookmark', 'jump to bookmark'],
                'show_bookmarks': ['show bookmarks', 'list bookmarks']
            },
            'info': {
                'show_info': ['show info', 'video info', 'information'],
                'show_stats': ['show stats', 'statistics', 'show statistics'],
                'current_time': ['what time', 'current time', 'where are we'],
                'duration': ['how long', 'video length', 'duration', 'total time']
            }
        }
    
    def _train_model(self):
        """Train the ML model with command patterns"""
        all_patterns = []
        self.command_list = []
        
        for category, commands in self.commands.items():
            for command, patterns in commands.items():
                for pattern in patterns:
                    all_patterns.append(pattern)
                    self.command_list.append(f"{category}.{command}")
        
        self.command_vectors = self.vectorizer.fit_transform(all_patterns)
    
    def extract_parameters(self, text: str) -> Dict:
        """Extract parameters from voice command"""
        params = {}
        
        # Extract numbers
        numbers = re.findall(r'\b(\d+(?:\.\d+)?)\b', text)
        if numbers:
            params['number'] = float(numbers[0])
        
        # Extract time patterns
        time_match = re.search(r'(\d+)\s*(?:minutes?|mins?)\s*(?:(\d+)\s*(?:seconds?|secs?))?', text)
        if time_match:
            minutes = int(time_match.group(1))
            seconds = int(time_match.group(2)) if time_match.group(2) else 0
            params['time'] = minutes * 60 + seconds
        
        # Extract percentage
        percent_match = re.search(r'(\d+)\s*(?:percent|%)', text)
        if percent_match:
            params['percent'] = int(percent_match.group(1))
        
        # Extract bookmark names
        bookmark_match = re.search(r'bookmark\s+(.+?)(?:\s+at|\s*$)', text)
        if bookmark_match:
            params['bookmark_name'] = bookmark_match.group(1).strip()
        
        return params
    
    def fuzzy_match(self, text: str, threshold: float = 0.6) -> List[Tuple[str, float]]:
        """Fuzzy matching for similar commands"""
        matches = []
        
        for i, command in enumerate(self.command_list):
            # Get the original pattern for this command
            pattern_found = False
            for category, commands in self.commands.items():
                for cmd, patterns in commands.items():
                    if f"{category}.{cmd}" == command:
                        for pattern in patterns:
                            similarity = SequenceMatcher(None, text.lower(), pattern.lower()).ratio()
                            if similarity >= threshold:
                                matches.append((command, similarity))
                                pattern_found = True
                                break
                    if pattern_found:
                        break
                if pattern_found:
                    break
        
        return sorted(matches, key=lambda x: x[1], reverse=True)
    
    def semantic_similarity(self, text: str, top_k: int = 5) -> List[Tuple[str, float]]:
        """Use TF-IDF cosine similarity for semantic matching"""
        text_vector = self.vectorizer.transform([text])
        similarities = cosine_similarity(text_vector, self.command_vectors).flatten()
        
        top_indices = similarities.argsort()[-top_k:][::-1]
        results = []
        
        for idx in top_indices:
            if similarities[idx] > 0.1:  # Minimum threshold
                results.append((self.command_list[idx], similarities[idx]))
        
        return results
    
    def detect_command(self, text: str) -> Dict:
        """Main command detection with ML enhancement"""
        text = text.lower().strip()
        
        # Extract parameters first
        params = self.extract_parameters(text)
        
        # Clean text for command matching
        clean_text = re.sub(r'\b\d+(?:\.\d+)?\b', '', text)  # Remove numbers
        clean_text = re.sub(r'\s+', ' ', clean_text).strip()
        
        # Get semantic similarities
        semantic_matches = self.semantic_similarity(clean_text)
        
        # Get fuzzy matches as fallback
        fuzzy_matches = self.fuzzy_match(clean_text)
        
        # Combine and rank results
        all_matches = {}
        
        # Weight semantic matches higher
        for command, score in semantic_matches:
            all_matches[command] = score * 1.5
        
        # Add fuzzy matches with lower weight
        for command, score in fuzzy_matches:
            if command in all_matches:
                all_matches[command] = max(all_matches[command], score * 0.8)
            else:
                all_matches[command] = score * 0.8
        
        # Get best match
        if all_matches:
            best_command = max(all_matches.items(), key=lambda x: x[1])
            
            return {
                'command': best_command[0],
                'confidence': best_command[1],
                'parameters': params,
                'original_text': text,
                'alternatives': sorted(all_matches.items(), key=lambda x: x[1], reverse=True)[:3]
            }
        
        return {
            'command': None,
            'confidence': 0.0,
            'parameters': params,
            'original_text': text,
            'alternatives': []
        }

if __name__ == "__main__":
    # Initialize and test the engine
    engine = VoiceCommandML()
    
    # Test commands
    test_commands = [
        "play the video",
        "make it louder",
        "jump to 2 minutes 30 seconds", 
        "set quality to 4k",
        "bookmark this as intro scene",
        "go to bookmark intro",
        "what's the current time",
        "take a screenshot"
    ]
    
    print("Voice Command ML Engine Test Results:")
    print("=" * 50)
    
    for cmd in test_commands:
        result = engine.detect_command(cmd)
        print(f"\nInput: '{cmd}'")
        print(f"Command: {result['command']}")
        print(f"Confidence: {result['confidence']:.3f}")
        print(f"Parameters: {result['parameters']}")
        if result['alternatives']:
            print(f"Alternatives: {[alt[0] for alt in result['alternatives'][:2]]}")
    
    print(f"\nModel ready with {len(engine.command_list)} patterns")