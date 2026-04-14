exports.handler = async (event) => {
  const p = event.queryStringParameters || {};

  const name      = p.name      || "Event";
  const date      = p.date      || "";
  const startTime = p.startTime || "";
  const state     = p.state     || "";
  const location  = p.location  || "";
  const desc      = p.desc      || "";

  const stateTimezones = {
    "AL": "America/Chicago",
    "AK": "America/Anchorage",
    "AZ": "America/Phoenix",
    "AR": "America/Chicago",
    "CA": "America/Los_Angeles",
    "CO": "America/Denver",
    "CT": "America/New_York",
    "DE": "America/New_York",
    "FL": "America/New_York",
    "GA": "America/New_York",
    "HI": "Pacific/Honolulu",
    "ID": "America/Denver",
    "IL": "America/Chicago",
    "IN": "America/Indiana/Indianapolis",
    "IA": "America/Chicago",
    "KS": "America/Chicago",
    "KY": "America/Kentucky/Louisville",
    "LA": "America/Chicago",
    "ME": "America/New_York",
    "MD": "America/New_York",
    "MA": "America/New_York",
    "MI": "America/Detroit",
    "MN": "America/Chicago",
    "MS": "America/Chicago",
    "MO": "America/Chicago",
    "MT": "America/Denver",
    "NE": "America/Chicago",
    "NV": "America/Los_Angeles",
    "NH": "America/New_York",
    "NJ": "America/New_York",
    "NM": "America/Denver",
    "NY": "America/New_York",
    "NC": "America/New_York",
    "ND": "America/Chicago",
    "OH": "America/New_York",
    "OK": "America/Chicago",
    "OR": "America/Los_Angeles",
    "PA": "America/New_York",
    "RI": "America/New_York",
    "SC": "America/New_York",
    "SD": "America/Chicago",
    "TN": "America/Chicago",
    "TX": "America/Chicago",
    "UT": "America/Denver",
    "VT": "America/New_York",
    "VA": "America/New_York",
    "WA": "America/Los_Angeles",
    "WV": "America/New_York",
    "WI": "America/Chicago",
    "WY": "America/Denver"
  };

  const tz = stateTimezones[state.toUpperCase()] || "America/New_York";

  function parseTime(date, time) {
    const [month, day, year] = date.split("/");
    const [timePart, meridiem] = time.trim().split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (meridiem.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (meridiem.toUpperCase() === "AM" && hours === 12) hours = 0;
    return { year: parseInt(year), month: parseInt(month), day: parseInt(day), hours, minutes };
  }

  function toICSString({ year, month, day, hours, minutes }) {
    return `${year}${String(month).padStart(2,"0")}${String(day).padStart(2,"0")}T${String(hours).padStart(2,"0")}${String(minutes).padStart(2,"0")}00`;
  }

  const start = parseTime(date, startTime);
  const end = { ...start, hours: start.hours + 2 };

  const startDT = toICSString(start);
  const endDT   = toICSString(end);

  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const uid = dtstamp + "@nafsbenefits.com";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//National Association Family Services//ICS Generator//EN",
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
    "ORGANIZER;CN=National Association Family Services:mailto:info@nafsbenefits.com",
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
