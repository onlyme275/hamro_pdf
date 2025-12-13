"""
Custom exception handler for REST framework.
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns consistent error responses.
    """
    response = exception_handler(exc, context)

    if response is not None:
        custom_response = {
            'success': False,
            'message': get_error_message(response.data),
            'errors': response.data if isinstance(response.data, dict) else {'detail': response.data},
        }
        response.data = custom_response

    return response


def get_error_message(data):
    """
    Extract a readable error message from response data.
    """
    if isinstance(data, dict):
        if 'detail' in data:
            return str(data['detail'])
        if 'non_field_errors' in data:
            return str(data['non_field_errors'][0])
        # Get first error message
        for key, value in data.items():
            if isinstance(value, list) and len(value) > 0:
                return f"{key}: {value[0]}"
            return f"{key}: {value}"
    if isinstance(data, list) and len(data) > 0:
        return str(data[0])
    return "An error occurred"
