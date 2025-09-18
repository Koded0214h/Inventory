# serializers.py
from rest_framework import serializers
from .models import Category, Unit, Item


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description"]


class UnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Unit
        fields = ["id", "name", "symbol"]


class ItemSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.UUIDField(write_only=True, required=False)
    unit = UnitSerializer(read_only=True)
    unit_id = serializers.UUIDField(write_only=True, required=False)

    class Meta:
        model = Item
        fields = [
            "id", "name", "description", "quantity",
            "category", "category_id",
            "unit", "unit_id",
            "image", "created_at"
        ]

    def create(self, validated_data):
        category_id = validated_data.pop("category_id", None)
        unit_id = validated_data.pop("unit_id", None)

        if category_id:
            validated_data["category_id"] = category_id
        if unit_id:
            validated_data["unit_id"] = unit_id

        return super().create(validated_data)
