import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { collectionGroup, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useUserData } from "../context/UserDataContext";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

const GROUP_COLORS = [
  "#2563EB", 
  "#10B981", 
  "#F59E0B", 
  "#EF4444",
  "#8B5CF6", 
  "#F43F5E",
];

export default function CalendarPage() {
  const { userData } = useUserData();
  const [events, setEvents] = useState([]);
  const [currentView, setCurrentView] = useState("dayGridMonth");
  const groupColorMap = {};

  useEffect(() => {
    if (!userData || !userData.joinedGroups || userData.joinedGroups.length === 0) return;

    const unsub = onSnapshot(collectionGroup(db, "sessions"), async (snapshot) => {
      const sessions = [];
      const colorPool = [...GROUP_COLORS];

      for (const docSnap of snapshot.docs) {
        const session = docSnap.data();
        const groupID = docSnap.ref.parent.parent.id;

        if (!userData.joinedGroups.includes(groupID)) continue;

        const groupRef = doc(db, "groups", groupID);
        const groupSnap = await getDoc(groupRef);
        const groupData = groupSnap.exists() ? groupSnap.data() : {};
        const groupName = groupData.groupName || "Unknown Group";

        if (!groupColorMap[groupName]) {
          groupColorMap[groupName] = colorPool.length > 0 ? colorPool.shift() : "#3B82F6";
        }

        const [year, month, day] = session.date.split("-").map(Number);
        const [hour, minute] = session.time.split(":" ).map(Number);
        const startDateTime = new Date(year, month - 1, day, hour, minute);

        sessions.push({
          title: session.title,
          start: startDateTime,
          end: startDateTime,
          groupName,
          link: session.link || "",
          backgroundColor: groupColorMap[groupName],
          borderColor: groupColorMap[groupName],
          textColor: "#ffffff",
        });
      }

      setEvents(sessions);
    });

    return () => unsub();
  }, [userData]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={events}
        height="auto"
        viewDidMount={({ view }) => setCurrentView(view.type)}
        eventContent={(arg) => {
          const isListView = currentView.includes("list");
          return (
            <div className={`flex items-center gap-1 text-sm ${isListView ? '' : 'truncate'}`}>
              {!isListView && (
                <span
                  className="inline-block w-2 h-2 rounded-full mt-0.5"
                  style={{ backgroundColor: arg.event.backgroundColor }}
                ></span>
              )}
              <div className="truncate  font-medium">
                {arg.event.title}
              </div>
            </div>
          );
        }}
        eventClick={(info) => {
          const link = info.event.extendedProps.link;
          if (link) window.open(link, "_blank");
        }}
        eventDidMount={(info) => {
          const group = info.event.extendedProps.groupName;
          const time = info.event.start.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          tippy(info.el, {
            content: `${info.event.title} — ${group} @ ${time}`,
          });
        }}
      />
    </div>
  );
}