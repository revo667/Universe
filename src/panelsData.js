export const panels = [
  {
    x: 100, y: 100, width: 300, height: 220, title: 'Spotify', active: false, scale: 1, type: 'music',
    track: { title: 'Paranoia', artist: 'Jota Yee', duration: 211, elapsed: 31, playing: true }
  },
  {
    x: 500, y: 150, width: 300, height: 200, title: 'Discord', active: false, scale: 1, type: 'discord',
    channel: '# genel',
    onlineCount: 12,
    messages: [
      { user: 'Ada', text: 'yeni güncelleme harika olmuş' },
      { user: 'Mert', text: 'cam efekti güzel durmuş' },
      { user: 'Selin', text: 'sürükleme artık çok akıcı' }
    ]
  },
  {
    x: 300, y: 400, width: 300, height: 200, title: 'Files', active: false, scale: 1, type: 'files',
    selectedIndex: null,
    files: [
      { name: 'Documents', kind: 'folder' },
      { name: 'Projects', kind: 'folder' },
      { name: 'renderer.js', kind: 'file', size: '6.1 KB' },
      { name: 'README.md', kind: 'file', size: '1.8 KB' }
    ]
  },
  {
    x: 700, y: 420, width: 320, height: 260, title: 'Assistant', active: false, scale: 1, type: 'chat',
    inputFocused: false,
    messages: [
      { sender: 'assistant', text: 'Sistem hazır.' },
      { sender: 'assistant', text: 'Nasıl yardımcı olabilirim?' }
    ]
  }
]