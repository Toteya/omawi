#!/usr/bin/env python3
"""
module test_base_module:
Contains unittests for base_model module
"""
from datetime import datetime
from models.base_model import BaseModel
import unittest


class TestBaseModel(unittest.TestCase):
    """
    Tests BaseModel class
    """

    def setUp(self):
        self.b1 = BaseModel()
        self.b2 = BaseModel()
        return super().setUp()

    def tearDown(self):
        del self.b1
        del self.b2
        return super().tearDown()

    def test_BaseModel(self):
        """ BaseModel instance is created and initialised correctly
        """
        self.assertIsInstance(self.b1.created_at, datetime)
        self.assertEqual(self.b1.created_at, self.b1.updated_at)

        dict = {
            'id': '1b3c52b7-1981-4e81-a75e-63af749ecb54',
            'created_at': '2025-03-18T10:46:06.603808',
            'updated_at': '2025-03-18T10:46:06.603808',
            '__class__': 'BaseModel',
            'random_attribute': 'random'
        }
        bm = BaseModel(**dict)
        self.assertNotIn('__class__', bm.__dict__)
        self.assertNotIn('random_attribute', bm.__dict__)
        self.assertIsInstance(bm.created_at, datetime)
        self.assertEqual(bm.created_at, bm.updated_at)

    def test_update(self):
        """ Update method updates the 'updated_at' attribute
        """
        self.assertEqual(self.b1.created_at, self.b1.updated_at)
        self.b1.update()
        self.assertGreater(self.b1.updated_at, self.b1.created_at)

    def test_to_dict(self):
        """ to_dict method returns the correct dictionary representation
        of the BaseModel instance
        """
        obj_dict = self.b1.to_dict()
        self.assertIsInstance(obj_dict, dict)
        self.assertEqual(obj_dict['__class__'], self.b1.__class__.__name__)
        self.assertNotIn('_sa_instance_state', obj_dict)
        self.assertIsInstance(obj_dict['created_at'], str)
        self.assertIsInstance(obj_dict['updated_at'], str)
