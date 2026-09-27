from django.db import models

class JobApplication(models.Model):

    STATUS_CHOICES = [
        ("Applied", "Applied"),
        ("Interview", "Interview"),
        ("Selected", "Selected"),
        ("Rejected", "Rejected"),
    ]

    company_name = models.CharField(max_length=100)

    job_role = models.CharField(max_length=100)

    location = models.CharField(max_length=100)

    salary = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default="Applied"
    )

    applied_date = models.DateField()

    job_url = models.URLField(blank=True)

    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.company_name} - {self.job_role}"
