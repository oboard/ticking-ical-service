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
          page: 0,
          size: 2000
        })
      })

      const apiData = await apiResp.json()

      if (apiData.status !== 200 || !Array.isArray(apiData.data)) {
        return new Response("Invalid API response", { status: 500 })
      }

      // 格式化函数（UTC → ICS 时间格式）
      function formatDate(d) {
        return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
      }

      // 生成事件
      const events = apiData.data
        .filter(e => e.isDeleted === 0 && e.state === 0)
        .map(e => {
          const start = new Date(e.startTime)
          let end = e.endTime ? new Date(e.endTime) : null

          // endTime=0，用 scheduledTime 补齐
          if (!end && e.scheduledTime > 0) {
            end = new Date(e.startTime + e.scheduledTime)
          }

          // 如果依旧没有结束时间，就忽略该事件
          if (!end) return null

          return `BEGIN:VEVENT
UID:${e.uuid}@i99yun
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
SUMMARY:${e.name}
END:VEVENT`
        })
        .filter(Boolean)

      // 生成 ICS 文件
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
