exports.handler = async (event) => {
  const p = event.queryStringParameters || {};

  const name     = p.name     || "Event";
  const startDT  = p.startDT  || "";
  const endDT    = p.endDT    || "";
  const tz       = p.tz       || "UTC";
  const location = p.location || "";
  const desc     = p.desc     || "";
  const orgname  = p.orgname  || "";
  const orgemail = p.orgemail || "";

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
