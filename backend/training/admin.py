from django.contrib import admin
from .models import Course, Module, Lesson, LessonResource

class ModuleInline(admin.StackedInline):
    model = Module
    extra = 0
    ordering = ('order',)

class LessonInline(admin.StackedInline):
    model = Lesson
    extra = 0
    ordering = ('order',)

class LessonResourceInline(admin.TabularInline):
    model = LessonResource
    extra = 0
    ordering = ('order',)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'level', 'created_at')
    search_fields = ('title', 'instructor')
    inlines = [ModuleInline]

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_editable = ('order',)
    ordering = ('course', 'order')
    inlines = [LessonInline]

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'duration', 'order')
    list_editable = ('order',)
    ordering = ('module', 'order')
    inlines = [LessonResourceInline]

@admin.register(LessonResource)
class LessonResourceAdmin(admin.ModelAdmin):
    list_display = ('name', 'lesson', 'type', 'order')
    list_editable = ('order',)
    ordering = ('lesson', 'order')
