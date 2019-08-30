module.exports = {
    "branches": [
        '+([0-9])?(.{+([0-9]),x}).x',
        'master',
        {
            name: 'feature/*',
            prerelease: '${name.replace(/^feature\\//g, "")}',
            channel: '${name.replace(/^feature\\//g, "")}'
        }
    ]
}