# Generated by Django 3.1.1 on 2020-09-05 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todoapp', '0007_auto_20200905_1620'),
    ]

    operations = [
        migrations.AddField(
            model_name='invite',
            name='valid_until',
            field=models.DateTimeField(blank=True, editable=False, null=True),
        ),
        migrations.AlterField(
            model_name='invite',
            name='id',
            field=models.CharField(default='EC9C69', max_length=10, primary_key=True, serialize=False),
        ),
    ]