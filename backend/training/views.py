
from rest_framework import generics, permissions
from .models import Course, Module, Lesson, LessonResource
from .serializers import CourseSerializer
from strategies.views import IsAdminOrReadOnly

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
