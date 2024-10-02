from django.test import TestCase
from .models import TeamMember

class TeamMemberModelTest(TestCase):
    def setUp(self):
        TeamMember.objects.create(
            first_name='John',
            last_name='Doe',
            phone_number='1234567890',
            email='john@example.com',
            role='admin'
        )

    def test_team_member_creation(self):
        member = TeamMember.objects.get(email='john@example.com')
        self.assertEqual(member.first_name, 'John')