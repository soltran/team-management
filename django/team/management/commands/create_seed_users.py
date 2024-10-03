from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Creates seed users for testing'

    def handle(self, *args, **options):
        users = [
            {'username': 'admin', 'email': 'admin@example.com', 'password': 'adminpass', 'is_staff': True, 'is_superuser': True},
            {'username': 'adam', 'email': 'adam.stepinski@instawork.com', 'password': 'adampass'},
            {'username': 'reshav', 'email': 'reshav@instawork.com', 'password': 'reshavpass', 'is_staff': True, 'is_superuser': True},
            {'username': 'sol', 'email': 'hi@soltran.io', 'password': 'solpass'},
        ]

        for user_data in users:
            username = user_data['username']
            email = user_data['email']
            password = user_data['password']
            is_staff = user_data.get('is_staff', False)
            is_superuser = user_data.get('is_superuser', False)

            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(username=username, email=email, password=password)
                user.is_staff = is_staff
                user.is_superuser = is_superuser
                user.save()
                self.stdout.write(self.style.SUCCESS(f'Successfully created user: {username}'))
            else:
                self.stdout.write(self.style.WARNING(f'User {username} already exists'))

        self.stdout.write(self.style.SUCCESS('Seed users created successfully'))