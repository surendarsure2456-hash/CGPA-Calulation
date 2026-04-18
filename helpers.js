// ============================================================
// Grade & CGPA Helpers
// ============================================================

export function gradeFromMarks(marks) {
  if (marks >= 90) return { letter: "O",  gp: 10 };
  if (marks >= 80) return { letter: "A+", gp: 9  };
  if (marks >= 70) return { letter: "A",  gp: 8  };
  if (marks >= 60) return { letter: "B+", gp: 7  };
  if (marks >= 50) return { letter: "B",  gp: 6  };
  if (marks >= 40) return { letter: "C",  gp: 5  };
  return             { letter: "F",  gp: 0  };
}

export function calcCGPA(subjects) {
  let totalPoints = 0;
  let totalCredits = 0;
  for (const s of subjects) {
    const gp = parseFloat(s.marks) / 10;
    totalPoints += gp * parseFloat(s.credits);
    totalCredits += parseFloat(s.credits);
  }
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

export function cgpaColor(cgpa) {
  if (cgpa >= 9)   return "#00e5a0";
  if (cgpa >= 7.5) return "#3dd6f5";
  if (cgpa >= 6)   return "#f5c842";
  if (cgpa >= 5)   return "#ff9f43";
  return "#ff6b6b";
}

export function cgpaClass(cgpa) {
  if (cgpa >= 9)   return "Outstanding";
  if (cgpa >= 7.5) return "Distinction";
  if (cgpa >= 6)   return "First Class";
  if (cgpa >= 5)   return "Pass";
  return "Fail";
}
