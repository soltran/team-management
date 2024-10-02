from django.core.management.base import BaseCommand
from team.models import TeamMember

class Command(BaseCommand):
    help = 'Seed the database with initial team members'

    def handle(self, *args, **kwargs):
        team_members = [
            # ... (keep the existing team member data)
        ]

        for member_data in team_members:
            TeamMember.objects.create(**member_data)

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database with team members'))