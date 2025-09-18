# models.py
from django.db import models
import uuid


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Unit(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)   # e.g., Yard, Meter, Piece
    symbol = models.CharField(max_length=10, unique=True) # e.g., yd, m, pcs

    def __str__(self):
        return f"{self.name} ({self.symbol})"


class Item(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="items")
    unit = models.ForeignKey(Unit, on_delete=models.SET_NULL, null=True, related_name="items")
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    image = models.ImageField(upload_to="item_images/", blank=True, null=True)  # ✅ moved here
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("name", "category")
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} - {self.quantity} {self.unit.symbol if self.unit else ''}"
