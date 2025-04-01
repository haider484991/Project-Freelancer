// Mock data for testing

export const mockDashboardData = {
  inactive_trainees_count: 7,
  trainees_count: 45,
  weekly_data: [
    { day: "Monday", count: 12 },
    { day: "Tuesday", count: 8 },
    { day: "Wednesday", count: 15 },
    { day: "Thursday", count: 10 },
    { day: "Friday", count: 6 },
    { day: "Saturday", count: 3 },
    { day: "Sunday", count: 2 }
  ],
  groups_distribution: [
    { name: "Weight Loss", trainees_count: 18 },
    { name: "Muscle Gain", trainees_count: 12 },
    { name: "Maintenance", trainees_count: 8 },
    { name: "Vegan", trainees_count: 7 }
  ]
};

export const mockGroupsData = {
  groups: [
    {
      id: "1",
      name: "Weight Loss",
      dietary_guidelines: "Focus on high protein, low carb diet",
      weekly_menu: "Monday: Chicken salad\nTuesday: Fish with vegetables\nWednesday: Turkey and quinoa\nThursday: Lean beef stir fry\nFriday: Tofu and vegetables\nWeekend: Free choice with calorie limits"
    },
    {
      id: "2",
      name: "Muscle Gain",
      dietary_guidelines: "High protein, moderate carbs, healthy fats",
      weekly_menu: "Monday: Salmon and rice\nTuesday: Chicken and sweet potatoes\nWednesday: Steak and quinoa\nThursday: Turkey and pasta\nFriday: Beef and rice\nWeekend: High-protein meals of choice"
    },
    {
      id: "3",
      name: "Maintenance",
      dietary_guidelines: "Balanced macronutrients, focus on whole foods",
      weekly_menu: "Monday: Mediterranean bowl\nTuesday: Chicken and vegetables\nWednesday: Fish and quinoa\nThursday: Vegetarian stir fry\nFriday: Turkey wrap\nWeekend: Balanced meals of choice"
    },
    {
      id: "4",
      name: "Vegan",
      dietary_guidelines: "Plant-based proteins, whole grains, fruits and vegetables",
      weekly_menu: "Monday: Tofu stir fry\nTuesday: Lentil soup\nWednesday: Chickpea curry\nThursday: Bean and vegetable bowl\nFriday: Tempeh and quinoa\nWeekend: Plant-based meals of choice"
    }
  ]
};

export const mockTraineesData = {
  trainees: [
    {
      id: "1",
      name: "John Smith",
      email: "john@example.com",
      phone: "0501234567",
      group_id: "1",
      target_calories: "2000",
      target_weight: "75",
      gender: "1",
      is_active: "1"
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "0527654321",
      group_id: "2",
      target_calories: "2200",
      target_weight: "65",
      gender: "2",
      is_active: "1"
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike@example.com",
      phone: "0533456789",
      group_id: "3",
      target_calories: "2500",
      target_weight: "80",
      gender: "1",
      is_active: "0"
    },
    {
      id: "4",
      name: "Emma Wilson",
      email: "emma@example.com",
      phone: "0549876543",
      group_id: "4",
      target_calories: "1800",
      target_weight: "60",
      gender: "2",
      is_active: "1"
    }
  ]
};

export const mockReportingsData = {
  reportings: [
    {
      id: "1",
      trainee_id: "1",
      trainee_name: "John Smith",
      report_date: "2023-04-15",
      meal_protein: "150",
      meal_carbs: "210",
      meal_fats: "70",
      calories: "2100"
    },
    {
      id: "2",
      trainee_id: "1",
      trainee_name: "John Smith",
      report_date: "2023-04-08",
      meal_protein: "145",
      meal_carbs: "220",
      meal_fats: "75",
      calories: "2200"
    },
    {
      id: "3",
      trainee_id: "2",
      trainee_name: "Sarah Johnson",
      report_date: "2023-04-14",
      meal_protein: "160",
      meal_carbs: "190",
      meal_fats: "65",
      calories: "2150"
    },
    {
      id: "4",
      trainee_id: "3",
      trainee_name: "Mike Chen",
      report_date: "2023-04-10",
      meal_protein: "170",
      meal_carbs: "230",
      meal_fats: "80",
      calories: "2450"
    }
  ]
};

export const mockSettingsData = {
  settings: {
    company_name: "FitTrack Coaching",
    email: "info@fittrack.com",
    phone: "055-123-4567",
    address: "123 Fitness St., Tel Aviv",
    logo_url: "/images/logo.png",
    default_target_calories: "2200",
    default_protein_ratio: "30",
    default_carbs_ratio: "40",
    default_fat_ratio: "30"
  }
}; 