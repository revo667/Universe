const dockIcons = {
  music: '🎵',
  discord: '🗨️',
  files: '📁',
  chat: '🤖'
}

export function initDock(dockEl, panels, onSelect) {
  const itemsByPanel = new Map()

  panels.forEach(panel => {
    const item = document.createElement('div')
    item.className = 'dock-item'
    item.textContent = dockIcons[panel.type] || '◆'
    item.title = panel.title

    item.addEventListener('click', () => {
      onSelect(panel)
      updateDockState(itemsByPanel)
    })

    itemsByPanel.set(panel, item)
    dockEl.appendChild(item)
  })

  updateDockState(itemsByPanel)
}

function updateDockState(itemsByPanel) {
  itemsByPanel.forEach((item, panel) => {
    const isOpen = !panel.closed && !panel.minimized
    item.classList.toggle('open', isOpen)
  })
}