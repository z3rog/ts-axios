const cookie = {
  read(name: string): string | null {
    const cookiePattern = new RegExp(`(^|;\\s*)(${name})=([^;]*)`)
    const match = document.cookie.match(cookiePattern)

    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
