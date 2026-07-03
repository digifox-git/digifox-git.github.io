async function check_path(path) {
    try {
        const response = await fetch(path)
        return response.ok
    } catch {
        return false
    }
}

export { check_path }