
import { useState } from "react";
import "./App.css";

const initialData: Record<string, string | number> = {
  Student_ID: 1,
  Semester_ID: 1,
  Age: 25,
  Gender: "Male",
  Region_Type: "Rural",
  Family_Size: 2,
  Parent_Education: "Secondary",
  Family_Income_Level: "Middle",
  Internet_Quality: 1.8,
  Study_Space_Quality: 7.7,
  Previous_GPA: 2.71,
  Number_of_Failed_Courses: 0,
  Total_Credits_Earned: 17,
  Weekly_Study_Hours: 37.2,
  Attendance_Rate: 73.5,
  Library_Visits_Per_Month: 8,
  Extracurricular_Hours: 1.4,
  Sleep_Hours: 6.8,
  Social_Media_Usage_Hours: 2.5,
  Stress_Level: 9.5,
  Motivation_Score: 7.3,
  Self_Efficacy_Score: 5.82,
  Midterm_Mark: 54.3,
};

function App() {
  const [form, setForm] = useState({ ...initialData });
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateField = (key: string, value: string) => {
    setForm((previous) => ({
      ...previous,
      [key]:
        typeof initialData[key] === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setPrediction(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/score`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Error de la API: ${response.status}`
        );
      }

      const result = await response.json();

      setPrediction(result.predicted_final_exam_score);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo obtener la predicción."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header>
        <p className="eyebrow">MACHINE LEARNING</p>
        <h1>Student Final Score Prediction</h1>
        <p>
          Introduce los datos del estudiante para estimar
          su calificación final.
        </p>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="fields">
          {Object.entries(form).map(([key, value]) => (
            <label key={key}>
              <span>{key.replaceAll("_", " ")}</span>
              <input
                type={
                  typeof initialData[key] === "number"
                    ? "number"
                    : "text"
                }
                step={
                  typeof initialData[key] === "number"
                    ? "any"
                    : undefined
                }
                value={value}
                onChange={(event) =>
                  updateField(key, event.target.value)
                }
                required
              />
            </label>
          ))}
        </section>

        <button type="submit" disabled={loading}>
          {loading ? "Calculando..." : "Predecir calificación"}
        </button>
      </form>

      {prediction !== null && (
        <section className="result" aria-live="polite">
          <p>Calificación final predicha</p>
          <strong>{prediction.toFixed(2)}</strong>
        </section>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </main>
  );
}

export default App;
