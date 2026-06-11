
from rest_framework import serializers
from .models import Course, Module, Lesson, LessonResource

class LessonResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonResource
        fields = ['id', 'name', 'type', 'file', 'url']

class LessonSerializer(serializers.ModelSerializer):
    resources = LessonResourceSerializer(many=True, required=False)
    description = serializers.CharField(required=False, allow_blank=True)
    videoUrl = serializers.CharField(source='video_url', required=False, allow_null=True, allow_blank=True)
    
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'duration', 'description', 'videoUrl', 'resources']

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, required=False)
    class Meta:
        model = Module
        fields = ['id', 'title', 'lessons']

class CourseSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, required=False)

    class Meta:
        model = Course
        fields = ['id', 'title', 'instructor', 'duration', 'enrolled', 'likes', 'level', 'image', 'description', 'modules']

    def create(self, validated_data):
        modules_data = validated_data.pop('modules', [])
        course = Course.objects.create(**validated_data)
        self._save_modules(course, modules_data)
        return course

    def update(self, instance, validated_data):
        modules_data = validated_data.pop('modules', [])
        
        # Update course fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update nested modules
        self._save_modules(instance, modules_data)
        return instance

    def _save_modules(self, course, modules_data):
        # Clear existing to maintain sync (or implement smart diffing)
        # For simplicity and given the UI usage, we'll recreate or update based on presence
        existing_module_ids = [m.id for m in course.modules.all()]
        new_module_ids = [m.get('id') for m in modules_data if m.get('id')]

        # Delete modules not in the new data
        for mod_id in existing_module_ids:
            if mod_id not in new_module_ids:
                Module.objects.filter(id=mod_id).delete()

        for index, module_item in enumerate(modules_data):
            lessons_data = module_item.pop('lessons', [])
            mod_id = module_item.get('id')
            
            if mod_id and mod_id in existing_module_ids:
                module_instance = Module.objects.get(id=mod_id)
                module_instance.title = module_item.get('title', module_instance.title)
                module_instance.order = index
                module_instance.save()
            else:
                module_instance = Module.objects.create(course=course, order=index, **module_item)
            
            self._save_lessons(module_instance, lessons_data)

    def _save_lessons(self, module, lessons_data):
        existing_lesson_ids = [l.id for l in module.lessons.all()]
        new_lesson_ids = [l.get('id') for l in lessons_data if l.get('id')]

        for les_id in existing_lesson_ids:
            if les_id not in new_lesson_ids:
                Lesson.objects.filter(id=les_id).delete()

        for index, lesson_item in enumerate(lessons_data):
            resources_data = lesson_item.pop('resources', [])
            les_id = lesson_item.get('id')
            
            if les_id and les_id in existing_lesson_ids:
                lesson_instance = Lesson.objects.get(id=les_id)
                for attr, value in lesson_item.items():
                    setattr(lesson_instance, attr, value)
                lesson_instance.order = index
                lesson_instance.save()
            else:
                lesson_instance = Lesson.objects.create(module=module, order=index, **lesson_item)
            
            self._save_resources(lesson_instance, resources_data)

    def _save_resources(self, lesson, resources_data):
        # For resources, we usually just clear and recreate or match by name/url
        lesson.resources.all().delete()
        for index, res_data in enumerate(resources_data):
            LessonResource.objects.create(lesson=lesson, order=index, **res_data)
