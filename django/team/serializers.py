from rest_framework import serializers
from .models import TeamMember

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id', 'first_name', 'last_name', 'phone_number', 'email', 'role']