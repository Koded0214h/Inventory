from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, UnitViewSet, ItemViewSet, ItemImageViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("units", UnitViewSet, basename="unit")
router.register("items", ItemViewSet, basename="item")
router.register("images", ItemImageViewSet, basename="itemimage")

urlpatterns = router.urls
