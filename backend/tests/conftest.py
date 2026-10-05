import os
import pytest

# Ensure tests don't try to resolve SRV records for MongoDB Atlas if there's no internet
os.environ["MONGODB_URI"] = "mongodb://localhost:27017/?serverSelectionTimeoutMS=1000"
os.environ["MONGODB_DB"] = "test_db"
