from django.contrib import admin
from .models import Category, Unit, Item, ItemImage

admin.site.register(Category)
admin.site.register(Unit)
admin.site.register(Item)
admin.site.register(ItemImage)
