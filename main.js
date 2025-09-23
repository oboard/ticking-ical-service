export default {
  async fetch(request, env, ctx) {
    try {
      // 解析 query 参数
      const url = new URL(request.url)
      const token = url.searchParams.get("token")
      const userId = url.searchParams.get("userId")

      if (!token || !userId) {
        return new Response("Missing token or userId", { status: 400 })
      }

      // 请求 API
      const apiResp = await fetch("https://todo.i99yun.com/v2/focus_time/get_pageable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Token": token
        },
        body: JSON.stringify({
          userId: Number(userId),
          page: 1,
          size: 100
        })
      })

      const apiData = await apiResp.json()

      if (apiData.status !== 200 || !Array.isArray(apiData.data)) {
        return new Response("Invalid API response", { status: 500 })
      }

      // 生成 ICS
      const events = apiData.data
        .filter(e => e.isDeleted === 0 && e.state === 0)
        .map(e => {
          const start = new Date(e.startTime) // 毫秒 -> Date
          const end = new Date(e.endTime)

          // 处理时区: e.timeZone 是小时偏移
          const tzOffsetMs = (e.timeZone || 0) * 60 * 60 * 1000
          const startUtc = new Date(start.getTime() - tzOffsetMs)
          const endUtc = new Date(end.getTime() - tzOffsetMs)

          function formatDate(d) {
            return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
          }

          return `BEGIN:VEVENT
UID:${e.uuid}@i99yun
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startUtc)}
DTEND:${formatDate(endUtc)}
SUMMARY:${e.name}
END:VEVENT`
        })

      const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//i99yun//FocusTime Export//CN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${events.join("\n")}
END:VCALENDAR`

      return new Response(ics, {
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition": 'attachment; filename="focus.ics"'
        }
      })
    } catch (err) {
      return new Response("Error: " + err.message, { status: 500 })
    }
  }
}
