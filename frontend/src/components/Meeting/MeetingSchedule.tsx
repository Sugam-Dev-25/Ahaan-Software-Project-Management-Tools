import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import Calendar from "react-calendar";

interface MeetingForm {
  title: string;
  date: string;
  time: string;
  description: string;
  emails: string;
}

export default function MeetingSchedule() {
  const [calendarDate, setCalendarDate] = useState(new Date());

  const [form, setForm] = useState<MeetingForm>({
    title: "",
    date: "",
    time: "",
    description: "",
    emails: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailArray = form.emails.split(",");

    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/meetings/schedule-meeting`,
      {
        ...form,
        emails: emailArray,
      }
    );

    alert("Meeting Scheduled");
  };

  return (
    <div className="p-10">
      <div className="grid grid-cols-2 gap-16">

        {/* LEFT SIDE FORM */}
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Schedule a Meeting
          </h1>

          <p className="text-gray-500 mb-10">
            Plan and organize meetings with your team.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              name="title"
              placeholder="Meeting Title"
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
            />

            <input
              type="date"
              name="date"
              value={form.date}
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
            />

            <input
              type="time"
              name="time"
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Meeting Description"
              rows={4}
              className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
            />

            <input
              name="emails"
              placeholder="Enter Emails (comma separated)"
              className="w-full px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              onChange={handleChange}
            />

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-black text-white font-semibold hover:bg-gray-900 transition"
            >
              Schedule Meeting
            </button>

          </form>
        </div>

        {/* RIGHT SIDE CALENDAR */}
        <div className="p-6">

          <h3 className="text-lg font-semibold mb-6">
            Calendar
          </h3>

          <div className="flex justify-center">

            <Calendar
              onChange={(date: any) => {
                setCalendarDate(date);

                setForm({
                  ...form,
                  date: new Date(date).toISOString().split("T")[0],
                });
              }}
              value={calendarDate}
              className="w-full max-w-md text-sm [&_button]:p-2 [&_button]:rounded-md"
            />

          </div>

        </div>

      </div>
    </div>
  );
}