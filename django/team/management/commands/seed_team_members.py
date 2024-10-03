from django.core.management.base import BaseCommand
from team.models import TeamMember
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Seed the database with initial team members'

    def handle(self, *args, **kwargs):
        # Clear existing data
        TeamMember.objects.all().delete()

        roles = ['regular', 'admin']
        team_members = [
            {
                "first_name": "Adam",
                "last_name": "Stepinski",
                "phone_number": "1234567890",
                "email": "adam.stepinski@instawork.com",
                "role": "admin",
            },
            {
                "first_name": "Reshav",
                "last_name": "Singla",
                "phone_number": "9876543210",
                "email": "reshav@instawork.com",
                "role": "admin",
            },
            {
                "first_name": "Sol",
                "last_name": "Tran",
                "phone_number": "5551234567",
                "email": "hi@soltran.io",
                "role": "regular",
            },
            {
                "first_name": "Emily",
                "last_name": "Brown",
                "phone_number": "7778889999",
                "email": "emily.brown@instawork.com",
                "role": "regular",
            },
            {
                "first_name": "David",
                "last_name": "Wilson",
                "phone_number": "3334445555",
                "email": "david.wilson@instawork.com",
                "role": "regular",
            },
        ]

        # Generate 15 more random team members
        for i in range(5):
            first_name = f"User{i+1}"
            last_name = f"Lastname{i+1}"
            phone_number = ''.join([str(random.randint(0, 9)) for _ in range(10)])
            email = f"{first_name.lower()}.{last_name.lower()}@instawork.com"
            role = random.choice(roles)

            team_members.append({
                "first_name": first_name,
                "last_name": last_name,
                "phone_number": phone_number,
                "email": email,
                "role": role,
            })

        for member_data in team_members:
            TeamMember.objects.create(**member_data)

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded the database with {len(team_members)} team members'))