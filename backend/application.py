"""
Elastic Beanstalk entry point
"""
from server import app as application

if __name__ == '__main__':
    application.run()
