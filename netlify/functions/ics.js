exports.handler = async (event) => {
  const p = event.queryStringParameters || {};

  const name     = p.name     || "Event";
  const date     = p.date     || "";
  const startTime = p.startTime || "";
  const endTime   = p.endTime   || "";
  const tz       = p.tz       || "UTC";
  const location = p.location || "";
  const desc     = p.desc     || "";
  const orgname  = p.orgname  || "";
  const orgemail = p.orgemail || "";

  function toICSDateTime(date, time) {
    // Parse MM/DD/YYYY
    const [month, day, year] = date.split("/");

    // Parse h:mm AM/PM
    const [timePart, meridiem] = time.trim().split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (meridiem.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;

    const mm = String(month).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const hh = String(hours).padStart(2, "0");
    const min = String(minutes).padStart(2, "0");

    return `${year}${mm}${dd}T${hh}${min}00`;
  }

  const startDT = toICSDateTime(date, startTime);
  const endDT   = toICSDateTime(date, endTime);

  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = dtstamp + "@yourorg.com";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//YourOrg//ICS Generator//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;TZID=${tz}:${startDT}`,
    `DTEND;TZID=${tz}:${endDT}`,
    `SUMMARY:${name}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${location}`,
    `ORGANIZER;CN=${orgname}:mailto:${orgemail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "attachment; filename=event.ics"
    },
    body: ics
  };
};
