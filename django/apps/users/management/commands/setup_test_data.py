from django.core.management.base import BaseCommand
from django.db import transaction
from django.apps import apps
CustomUser = apps.get_model('users', 'CustomUser')
Company = apps.get_model('users', 'Company')
import random

class Command(BaseCommand):
    help = 'Creates initial test data including superuser, companies, and users'

    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write('Creating seed data...')

        # Create superuser
        if not CustomUser.objects.filter(username='admin').exists():
            CustomUser.objects.create_superuser(
                'admin', 'admin@soltran.io', 'adminpass',
                role='admin',
                is_superuser=True,
                is_staff=True,
                phone_number='+1234567890'
            )
            self.stdout.write(self.style.SUCCESS('Superuser created'))

        # Create companies
        companies = [
            Company.objects.create(name='Instawork'),
            Company.objects.create(name='SolTranCo'),
            Company.objects.create(name='Rubrik'),
        ]

        # Create users for each company
        roles = ['admin', 'regular']
        for company in companies:
            # Create an admin for the company
            CustomUser.objects.create_user(
                f'{company.name.lower()}_admin',
                f'reshav@{company.name.lower()}.com',
                'password',
                role='admin',
                company=company,
                phone_number=f'+1{random.randint(1000000000, 9999999999)}',
                first_name='Reshav',
                last_name='Singla',
            )

            CustomUser.objects.create_user(
                f'{company.name.lower()}_adam',
                f'adam@{company.name.lower()}.com',
                'password',
                role='regular',
                company=company,
                phone_number=f'+1{random.randint(1000000000, 9999999999)}',
                first_name='Adam',
                last_name='Stepinski',
            )

            CustomUser.objects.create_user(
                f'{company.name.lower()}_sol',
                f'sol@{company.name.lower()}.com',
                'password',
                role='regular',
                company=company,
                phone_number=f'+1{random.randint(1000000000, 9999999999)}',
                first_name='Sol',
                last_name='Tran',
            )

            # Create regular users for the company
            for i in range(5):  # Create 5 regular users per company
                CustomUser.objects.create_user(
                    f'{company.name.lower()}_user{i+1}',
                    f'user{i+1}@{company.name.lower()}.com',
                    'password',
                    role='regular',
                    company=company,
                    phone_number=f'+1{random.randint(1000000000, 9999999999)}',
                    first_name=random.choice(['Ayla', 'Sam', 'Chris', 'Pat', 'Jordan']),
                    last_name=random.choice(['Pham', 'Miller', 'Wilson', 'Moore', 'Taylor']),
                )

        self.stdout.write(self.style.SUCCESS('Seed data created successfully'))

        # Print out the created data
        self.stdout.write('\nCreated Companies:')
        for company in Company.objects.all():
            self.stdout.write(f'- {company.name}')

        self.stdout.write('\nCreated Users:')
        for user in CustomUser.objects.all():
            self.stdout.write(f'- {user.username} ({user.role}) - {user.company}')