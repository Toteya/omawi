#!/usr/bin/env python3
"""
module test_db_storage:
Contains unittests for db_storage
"""
from models import storage
from models.user import User
from models.composer import Composer
from unittest import TestCase


class TestDBStorage(TestCase):
    """
    Tests DBStorage - MYSQL database storage engine
    """

    @classmethod
    def setUpClass(cls):
        storage.load()
        storage.new(User(name='user1', email='user1@mail.com',
                         password='myPass123', id='3dbec226-b310-4d8c'))
        storage.new(User(name='user2', email='user2@mail.com',
                         password='secretpwd', id='3dbec226-b910-4d8c'))
        storage.new(Composer(name='Mozart', id='24321c01-f643'))
        storage.save()

    @classmethod
    def tearDownClass(cls):
        storage.close()

    def test_all(self):
        """ all() method returns all the objects stored in the database
        and if the class is specified, returns only the object from that class
        """
        self.assertEqual(len(storage.all()), 3)
        self.assertEqual(len(storage.all(User)), 2)
        self.assertEqual(len(storage.all(Composer)), 1)

    def test_get(self):
        """ get() returns the correct object as per the given class and id
        """
        # Object exist -> return the correct object
        obj = storage.get(Composer, id='24321c01-f643')
        self.assertEqual(obj.name, 'Mozart')
        # Object ID does not exist -> return None
        obj = storage.get(User, id='24681c01-f521')
        self.assertIsNone(obj)
        # No arguments -> return None
        obj = storage.get()
        self.assertIsNone(obj)
        # Only one argument -> return None
        obj = storage.get(User)
        self.assertIsNone(obj)

    def test_get_by_filter(self):
        """ get_by_filter() must query and return the first object matching
        the given class and filter
        """
        # Existing user account object m
        user = storage.get_by_filter(User, email='user1@mail.com')
        try:
            self.assertEqual(user.name, 'user1')
        except AttributeError:
            self.fail('Test failed: User not found or missing attribute')
        # Existing composer object
        composer = storage.get_by_filter(Composer, name='Mozart')
        try:
            self.assertEqual(composer.id, '24321c01-f643')
        except AttributeError:
            self.fail('Test failed: Composer not found or missing attribute')
        # Non-existing composer -> must return None
        composer = storage.get_by_filter(Composer, id='fake_id')
        self.assertIsNone(composer)

    def test_delete(self):
        commposer1 = Composer(name='Sibelius', id='5623f420-c341')
        storage.new(commposer1)
        storage.save()
        count_before = len(storage.all())
        storage.delete(commposer1)
        count_after = len(storage.all())
        self.assertLess(count_after, count_before)
