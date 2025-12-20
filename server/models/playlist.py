#!/usr/bin/env python3
"""
module playlist: implements user playlist
"""
from models.base_model import BaseModel


class Playlist(BaseModel):
    """
    A plaaylist
    """
    name = ''
    user_id = ''
    songs = []

    # Set up many-to-many relationship with song_numbers
