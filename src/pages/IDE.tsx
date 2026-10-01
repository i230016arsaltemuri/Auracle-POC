import { CheckCircle, XCircle, Bot, Folder, File, ChevronRight, Terminal as TerminalIcon, GitBranch, Play, Pause } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'

import { FILES } from '../data/ideContent'

export default function IDE() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const step = searchParams.get('step') || '1'
  const isInstallStep = step === 'install' || location.pathname === '/install-auracle'
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'mayachen@MacBook-Pro payments-api % git status',
    'On branch feat/refund-retry-policy',
    'Changes not staged for commit:',
    '  (use "git add <file>..." to update what will be committed)',
    '  (use "git restore <file>..." to discard changes in working directory)',
    '\tmodified:   payments/service.py',
    '',
    'no changes added to commit (use "git add" and/or "git commit -a")'
  ])
  const [inputValue, setInputValue] = useState('')
  const [activeFile, setActiveFile] = useState('src/payments/service.py')
  const [fileContents, setFileContents] = useState(FILES)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['payments-api', 'src', 'src/payments', 'tests', 'tests/unit', 'tests/unit/payments']))
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const isSidebarResizing = useRef(false)
  const [terminalHeight, setTerminalHeight] = useState(250)
  const isTerminalResizing = useRef(false)
  const [isTyping, setIsTyping] = useState(false)
  const typingLineIdx = useRef(0)
  const typingCharIdx = useRef(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const isPausedRef = useRef(false)

  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextPaused = !isPausedRef.current
    setIsPaused(nextPaused)
    isPausedRef.current = nextPaused
  }

  const playJourney = async () => {
    setIsAutoPlaying(true)
    setTerminalOutput([])

    const sleep = async (ms: number) => {
      let elapsed = 0;
      const tick = 100;
      while (elapsed < ms) {
        if (!isPausedRef.current) {
          elapsed += tick;
        }
        await new Promise(r => setTimeout(r, tick));
      }
    }

    if (isInstallStep) {
      // === Auracle Installation Journey ===
      setTerminalOutput(prev => [...prev, '# Ahmed: "I need to understand what actually changed. Let me install Auracle."'])
      await sleep(2000)
      setTerminalOutput(prev => [...prev, 'ahmed@MacBook-Pro payments-api % pip install auracle'])
      await sleep(1000)
      setTerminalOutput(prev => [...prev, 'Collecting auracle', '  Downloading auracle-1.4.2-py3-none-any.whl (84 kB)', '     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 84.3/84.3 kB 1.2 MB/s eta 0:00:00'])
      await sleep(1200)
      setTerminalOutput(prev => [...prev, 'Installing collected packages: auracle', 'Successfully installed auracle-1.4.2'])
      await sleep(1500)
      setTerminalOutput(prev => [...prev, 'ahmed@MacBook-Pro payments-api % auracle init'])
      await sleep(800)
      setTerminalOutput(prev => [...prev, ''])
      setTerminalOutput(prev => [...prev, '  🔍 Auracle — Repository Initialization'])
      setTerminalOutput(prev => [...prev, '  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'])
      await sleep(600)
      setTerminalOutput(prev => [...prev, '  Scanning repository...'])
      await sleep(800)
      setTerminalOutput(prev => [...prev, '  Language:          Python'])
      setTerminalOutput(prev => [...prev, '  Test Framework:    pytest'])
      setTerminalOutput(prev => [...prev, '  Coverage Provider: pytest-cov'])
      setTerminalOutput(prev => [...prev, '  SCM:               Git'])
      setTerminalOutput(prev => [...prev, '  Provider:          GitHub'])
      setTerminalOutput(prev => [...prev, '  Default Branch:    main'])
      await sleep(1000)
      setTerminalOutput(prev => [...prev, ''])
      setTerminalOutput(prev => [...prev, '  Discovering Python source files...'])
      await sleep(800)
      setTerminalOutput(prev => [...prev, '  Found 142 source files'])
      setTerminalOutput(prev => [...prev, '  Found 3,450 test files'])
      await sleep(600)
      setTerminalOutput(prev => [...prev, '  Extracting ASTs, functions, classes, imports...'])
      await sleep(1200)
      setTerminalOutput(prev => [...prev, '  Building dependency and impact graph...'])
      await sleep(1000)
      setTerminalOutput(prev => [...prev, '  Importing coverage data from pytest-cov...'])
      await sleep(800)
      setTerminalOutput(prev => [...prev, ''])
      setTerminalOutput(prev => [...prev, '  ✓ Repository ready.'])
      setTerminalOutput(prev => [...prev, '  ✓ Mode: SHADOW (full suite still runs, Auracle observes)'])
      await sleep(800)
      setTerminalOutput(prev => [...prev, ''])
      setTerminalOutput(prev => [...prev, '  auracle.yaml written to project root.'])
      await sleep(1500)
      setTerminalOutput(prev => [...prev, 'ahmed@MacBook-Pro payments-api % git add auracle.yaml && git push'])
      await sleep(1000)
      setTerminalOutput(prev => [...prev, 'To github.com:acme/payments-api.git', '   a92f31e..d83cc4f  feature/partial-refund -> feature/partial-refund'])
      await sleep(1500)
      setTerminalOutput(prev => [...prev, '', '# Auracle GitHub App is now watching this PR...'])
      await sleep(2000)
      setIsAutoPlaying(false)
      navigate('/github/pr/184?step=1')
      return
    }

    await sleep(500)
    setTerminalOutput(prev => [...prev, 'ahmed@MacBook-Pro payments-api % git checkout -b feature/partial-refund'])
    await sleep(800)
    setTerminalOutput(prev => [...prev, "Switched to a new branch 'feature/partial-refund'"])
    await sleep(1500)
    
    setActiveFile('src/payments/service.py')
    await sleep(1000)
    
    // Animate typing the change
    const codeToType = "        if refund_amount < original_payment.amount:\n            self.process_partial_refund(original_payment)"
    
    // Pre-insert two empty lines at index 10 so we don't create a sparse array
    setFileContents(prev => {
        const next = { ...prev }
        const file = [...next['src/payments/service.py']]
        file.splice(10, 0, 
            { n: 129, t: '', c: '', cov: 'uncovered', changed: true },
            { n: 130, t: '', c: '', cov: 'uncovered', changed: true }
        )
        // Shift line numbers for the rest of the file
        for (let j = 12; j < file.length; j++) {
            file[j] = { ...file[j], n: file[j].n + 2 }
        }
        next['src/payments/service.py'] = file
        return next
    })

    let currentText = ""
    for (let i = 0; i < codeToType.length; i++) {
        currentText += codeToType[i]
        const lines = currentText.split('\n')
        
        setFileContents(prev => {
            const next = { ...prev }
            const file = [...next['src/payments/service.py']]
            
            file[10] = { ...file[10], c: lines[0] }
            if (lines.length > 1) {
                file[11] = { ...file[11], c: lines[1] }
            }
            next['src/payments/service.py'] = file
            return next
        })
        await sleep(25)
    }
    
    await sleep(1500)
    setTerminalOutput(prev => [...prev, 'ahmed@MacBook-Pro payments-api % pytest tests/unit/payments/test_service.py'])
    await sleep(800)
    setTerminalOutput(prev => [...prev, '============================= test session starts =============================='])
    await sleep(400)
    setTerminalOutput(prev => [...prev, 'collected 5 items'])
    await sleep(600)
    setTerminalOutput(prev => [...prev, 'tests/unit/payments/test_service.py .....                                [100%]'])
    setTerminalOutput(prev => [...prev, '============================== 5 passed in 0.12s ==============================='])
    
    await sleep(2000)
    setTerminalOutput(prev => [...prev, '', '# Ahmed: "Were these actually all the tests affected by the change?"', '# Ahmed: "I have no idea... I better run everything."'])
    
    await sleep(2500)
    setTerminalOutput(prev => [...prev, 'ahmed@MacBook-Pro payments-api % pytest'])
    await sleep(800)
    setTerminalOutput(prev => [...prev, '============================= test session starts =============================='])
    await sleep(600)
    setTerminalOutput(prev => [...prev, 'collected 3,450 items'])
    await sleep(800)
    setTerminalOutput(prev => [...prev, 'tests/unit/payments/test_auth.py ........                                [  0%]'])
    await sleep(400)
    setTerminalOutput(prev => [...prev, 'tests/unit/payments/test_billing.py ...............                      [  1%]'])
    await sleep(600)
    setTerminalOutput(prev => [...prev, 'tests/unit/payments/test_cache.py .....                                  [  1%]'])
    await sleep(800)
    setTerminalOutput(prev => [...prev, '', '⏳ Running... (Estimated time: 32 minutes)'])
    
    await sleep(3000)
    setTerminalOutput(prev => [...prev, '^C', 'ahmed@MacBook-Pro payments-api % git add .'])
    await sleep(800)
    setTerminalOutput(prev => [...prev, 'ahmed@MacBook-Pro payments-api % git commit -m "Add Partial Refund Support"'])
    await sleep(800)
    setTerminalOutput(prev => [...prev, '[feature/partial-refund a92f31e] Add Partial Refund Support', ' 1 file changed, 2 insertions(+), 0 deletions(-)'])
    
    await sleep(1500)
    setTerminalOutput(prev => [...prev, 'ahmed@MacBook-Pro payments-api % git push origin feature/partial-refund'])
    await sleep(1000)
    setTerminalOutput(prev => [...prev, 
      'Enumerating objects: 5, done.', 
      'Counting objects: 100% (5/5), done.', 
      'Delta compression using up to 8 threads', 
      'Compressing objects: 100% (3/3), done.', 
      'Writing objects: 100% (3/3), 324 bytes | 324.00 KiB/s, done.', 
      'Total 3 (delta 2), reused 0 (delta 0), pack-reused 0', 
      'To github.com:acme/payments-api.git', 
      ' * [new branch]      feature/partial-refund -> feature/partial-refund', 
      '', 
      'Opening PR view...'
    ])
    
    await sleep(2000)
    setIsAutoPlaying(false)
    navigate('/github/pr/184?step=0')
  }

  const simulateTyping = () => {
    setActiveFile('tests/unit/payments/test_refund.py')
    setIsTyping(true)
    
    const targetFile = FILES['tests/unit/payments/test_refund.py']
    
    // Clear the file contents initially
    setFileContents(prev => ({
      ...prev,
      'tests/unit/payments/test_refund.py': targetFile.map(l => ({ ...l, c: '' }))
    }))

    typingLineIdx.current = 0
    typingCharIdx.current = 0

    const interval = setInterval(() => {
      setFileContents(prev => {
        if (typingLineIdx.current >= targetFile.length) {
          clearInterval(interval)
          // Use setTimeout to clear isTyping to avoid updating state while rendering
          setTimeout(() => setIsTyping(false), 0)
          return prev
        }

        const next = { ...prev }
        const file = [...next['tests/unit/payments/test_refund.py']]
        const targetLine = targetFile[typingLineIdx.current]
        
        if (typingCharIdx.current < targetLine.c.length) {
          file[typingLineIdx.current] = { ...file[typingLineIdx.current], c: targetLine.c.substring(0, typingCharIdx.current + 1) }
          typingCharIdx.current++
        } else {
          // Move to next line
          typingLineIdx.current++
          typingCharIdx.current = 0
        }
        
        next['tests/unit/payments/test_refund.py'] = file
        return next
      })
    }, 15) // Adjust typing speed here
  }

  useEffect(() => {
    if (isInstallStep) {
      // Small delay so the IDE renders first before starting the animation
      const t = setTimeout(() => playJourney(), 800)
      return () => clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isSidebarResizing.current) {
        const newWidth = e.clientX - 48
        if (newWidth > 120 && newWidth < 800) {
          setSidebarWidth(newWidth)
        }
      }
      
      if (isTerminalResizing.current) {
        const newHeight = window.innerHeight - e.clientY
        if (newHeight > 100 && newHeight < window.innerHeight - 200) {
          setTerminalHeight(newHeight)
        }
      }
    }

    const handleMouseUp = () => {
      isSidebarResizing.current = false
      isTerminalResizing.current = false
      document.body.style.cursor = 'default'
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleSidebarMouseDown = () => {
    isSidebarResizing.current = true
    document.body.style.cursor = 'col-resize'
  }

  const handleTerminalMouseDown = () => {
    isTerminalResizing.current = true
    document.body.style.cursor = 'row-resize'
  }

  const handleLineChange = (filename: string, lineIndex: number, newText: string) => {
    setFileContents(prev => {
      const updated = { ...prev }
      updated[filename] = [...updated[filename]]
      updated[filename][lineIndex] = { ...updated[filename][lineIndex], c: newText }
      return updated
    })
  }

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(folder)) next.delete(folder)
      else next.add(folder)
      return next
    })
  }

  const renderFolder = (name: string, path: string, level: number, children: React.ReactNode) => {
    const isExpanded = expandedFolders.has(path)
    return (
      <>
        <div onClick={() => toggleFolder(path)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: `4px 12px 4px ${12 + level * 16}px`, cursor: 'pointer' }}>
          <ChevronRight size={14} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.1s' }} /> <Folder size={14} color="#60a5fa" /> {name}
        </div>
        {isExpanded && children}
      </>
    )
  }

  const renderFile = (name: string, path: string, level: number, options: { modified?: boolean, added?: boolean, iconColor?: string } = {}) => {
    const isActive = activeFile === path
    return (
      <div onClick={() => setActiveFile(path)} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: `4px 12px 4px ${12 + level * 16 + 18}px`, background: isActive ? '#37373d' : 'transparent', color: isActive ? '#fff' : '#ccc', cursor: 'pointer' }}>
        <File size={14} color={options.iconColor || "#4f7fff"} /> {name}
        {options.modified && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--yellow)', marginLeft: 'auto' }} title="Modified"/>}
        {options.added && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', marginLeft: 'auto' }} title="Added"/>}
      </div>
    )
  }

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const cmd = inputValue.trim()
      setInputValue('')
      
      setTerminalOutput(prev => [...prev, `mayachen@MacBook-Pro payments-api % ${cmd}`])
      
      if (cmd === 'git add .') {
        setTimeout(() => setTerminalOutput(prev => [...prev]), 100)
      } else if (cmd.startsWith('git commit')) {
        setTimeout(() => setTerminalOutput(prev => [...prev, '[feat/refund-retry-policy a92f31e] Support guarded retries', ' 1 file changed, 10 insertions(+), 5 deletions(-)']), 200)
      } else if (cmd.startsWith('git push')) {
        setTimeout(() => {
          setTerminalOutput(prev => [...prev, 'Enumerating objects: 5, done.', 'Counting objects: 100% (5/5), done.', 'Delta compression using up to 8 threads', 'Compressing objects: 100% (3/3), done.', 'Writing objects: 100% (3/3), 324 bytes | 324.00 KiB/s, done.', 'Total 3 (delta 2), reused 0 (delta 0), pack-reused 0', 'To github.com:acme/payments-api.git', '   92ac81d..a92f31e  feat/refund-retry-policy -> feat/refund-retry-policy', '', 'Opening PR view...'])
          setTimeout(() => navigate(`/github/pr/184?step=${step}`), 1500)
        }, 500)
      } else if (cmd !== '') {
        setTimeout(() => setTerminalOutput(prev => [...prev, `command not found: ${cmd}`]), 100)
      }
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#1e1e1e', color: '#cccccc', fontFamily: '"SF Pro Text", "Segoe UI", sans-serif' }}>
      {/* Fake VS Code Menu Bar */}
      <div style={{ height: 30, backgroundColor: '#333333', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 13, gap: 16 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28ca41' }} />
        </div>
        <span style={{ color: '#fff' }}>File</span>
        <span style={{ color: '#fff' }}>Edit</span>
        <span style={{ color: '#fff' }}>Selection</span>
        <span style={{ color: '#fff' }}>View</span>
        <span style={{ color: '#fff' }}>Go</span>
        <span style={{ color: '#fff' }}>Run</span>
        <span style={{ color: '#fff' }}>Terminal</span>
        <div style={{ margin: '0 auto', color: '#999', fontSize: 12 }}>service.py - payments-api - Visual Studio Code</div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* VS Code Activity Bar */}
        <div style={{ width: 48, backgroundColor: '#333333', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 10, gap: 20 }}>
           <File size={24} color="#fff" />
           <TerminalIcon size={24} color="#888" />
           <GitBranch size={24} color="#888" />
        </div>

        {/* File Explorer */}
        <div style={{ width: sidebarWidth, backgroundColor: '#252526', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
          <div style={{ padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', color: '#ccc', letterSpacing: '0.05em', position: 'sticky', top: 0, backgroundColor: '#252526', zIndex: 1 }}>
            Explorer
          </div>
          <div style={{ padding: '8px 0', fontSize: 13, color: '#ccc' }}>
            {renderFolder('payments-api', 'payments-api', 0, (
              <>
                {renderFolder('src', 'src', 1, (
                  <>
                    {renderFolder('payments', 'src/payments', 2, (
                      <>
                        {renderFile('service.py', 'src/payments/service.py', 3, { modified: true })}
                        {renderFile('models.py', 'src/payments/models.py', 3)}
                        {renderFile('exceptions.py', 'src/payments/exceptions.py', 3)}
                        {renderFile('gateway.py', 'src/payments/gateway.py', 3)}
                        {renderFile('auth.py', 'src/payments/auth.py', 3)}
                        {renderFile('billing.py', 'src/payments/billing.py', 3)}
                        {renderFile('cache.py', 'src/payments/cache.py', 3)}
                        {renderFile('currency.py', 'src/payments/currency.py', 3)}
                        {renderFile('db.py', 'src/payments/db.py', 3)}
                        {renderFile('events.py', 'src/payments/events.py', 3)}
                        {renderFile('fraud.py', 'src/payments/fraud.py', 3)}
                        {renderFile('hashing.py', 'src/payments/hashing.py', 3)}
                        {renderFile('invoices.py', 'src/payments/invoices.py', 3)}
                        {renderFile('jwt.py', 'src/payments/jwt.py', 3)}
                        {renderFile('kafka.py', 'src/payments/kafka.py', 3)}
                        {renderFile('limits.py', 'src/payments/limits.py', 3)}
                        {renderFile('metrics.py', 'src/payments/metrics.py', 3)}
                        {renderFile('notifications.py', 'src/payments/notifications.py', 3)}
                        {renderFile('payouts.py', 'src/payments/payouts.py', 3)}
                        {renderFile('quotes.py', 'src/payments/quotes.py', 3)}
                        {renderFile('receipts.py', 'src/payments/receipts.py', 3)}
                        {renderFile('subscriptions.py', 'src/payments/subscriptions.py', 3)}
                        {renderFile('taxes.py', 'src/payments/taxes.py', 3)}
                        {renderFile('users.py', 'src/payments/users.py', 3)}
                        {renderFile('webhooks.py', 'src/payments/webhooks.py', 3)}
                      </>
                    ))}
                    {renderFolder('api', 'src/api', 2, (
                      <>
                        {renderFile('routes.py', 'src/api/routes.py', 3)}
                        {renderFile('middlewares.py', 'src/api/middlewares.py', 3)}
                        {renderFile('serializers.py', 'src/api/serializers.py', 3)}
                        {renderFile('endpoints.py', 'src/api/endpoints.py', 3)}
                        {renderFile('pagination.py', 'src/api/pagination.py', 3)}
                        {renderFile('responses.py', 'src/api/responses.py', 3)}
                        {renderFile('validators.py', 'src/api/validators.py', 3)}
                      </>
                    ))}
                    {renderFolder('core', 'src/core', 2, (
                      <>
                        {renderFile('config.py', 'src/core/config.py', 3)}
                        {renderFile('utils.py', 'src/core/utils.py', 3)}
                        {renderFile('logging.py', 'src/core/logging.py', 3)}
                        {renderFile('telemetry.py', 'src/core/telemetry.py', 3)}
                        {renderFile('secrets.py', 'src/core/secrets.py', 3)}
                        {renderFile('feature_flags.py', 'src/core/feature_flags.py', 3)}
                      </>
                    ))}
                  </>
                ))}

                {renderFolder('tests', 'tests', 1, (
                  <>
                    {renderFolder('unit', 'tests/unit', 2, (
                      <>
                        {renderFolder('payments', 'tests/unit/payments', 3, (
                          <>
                            {step === '2' && renderFile('test_refund.py', 'tests/unit/payments/test_refund.py', 4, { added: true })}
                            {renderFile('test_models.py', 'tests/unit/payments/test_models.py', 4)}
                            {renderFile('test_auth.py', 'tests/unit/payments/test_auth.py', 4)}
                            {renderFile('test_billing.py', 'tests/unit/payments/test_billing.py', 4)}
                            {renderFile('test_cache.py', 'tests/unit/payments/test_cache.py', 4)}
                            {renderFile('test_currency.py', 'tests/unit/payments/test_currency.py', 4)}
                            {renderFile('test_db.py', 'tests/unit/payments/test_db.py', 4)}
                            {renderFile('test_events.py', 'tests/unit/payments/test_events.py', 4)}
                            {renderFile('test_fraud.py', 'tests/unit/payments/test_fraud.py', 4)}
                            {renderFile('test_hashing.py', 'tests/unit/payments/test_hashing.py', 4)}
                            {renderFile('test_invoices.py', 'tests/unit/payments/test_invoices.py', 4)}
                            {renderFile('test_jwt.py', 'tests/unit/payments/test_jwt.py', 4)}
                            {renderFile('test_kafka.py', 'tests/unit/payments/test_kafka.py', 4)}
                            {renderFile('test_limits.py', 'tests/unit/payments/test_limits.py', 4)}
                            {renderFile('test_metrics.py', 'tests/unit/payments/test_metrics.py', 4)}
                            {renderFile('test_notifications.py', 'tests/unit/payments/test_notifications.py', 4)}
                            {renderFile('test_payouts.py', 'tests/unit/payments/test_payouts.py', 4)}
                            {renderFile('test_quotes.py', 'tests/unit/payments/test_quotes.py', 4)}
                            {renderFile('test_receipts.py', 'tests/unit/payments/test_receipts.py', 4)}
                            {renderFile('test_subscriptions.py', 'tests/unit/payments/test_subscriptions.py', 4)}
                            {renderFile('test_taxes.py', 'tests/unit/payments/test_taxes.py', 4)}
                            {renderFile('test_users.py', 'tests/unit/payments/test_users.py', 4)}
                            {renderFile('test_webhooks.py', 'tests/unit/payments/test_webhooks.py', 4)}
                          </>
                        ))}
                        {renderFolder('api', 'tests/unit/api', 3, (
                          <>
                            {renderFile('test_routes.py', 'tests/unit/api/test_routes.py', 4)}
                            {renderFile('test_middlewares.py', 'tests/unit/api/test_middlewares.py', 4)}
                            {renderFile('test_serializers.py', 'tests/unit/api/test_serializers.py', 4)}
                          </>
                        ))}
                      </>
                    ))}
                    {renderFolder('integration', 'tests/integration', 2, (
                      <>
                        {renderFile('test_stripe_gateway.py', 'tests/integration/test_stripe_gateway.py', 3)}
                        {renderFile('test_paypal_gateway.py', 'tests/integration/test_paypal_gateway.py', 3)}
                        {renderFile('test_adyen_gateway.py', 'tests/integration/test_adyen_gateway.py', 3)}
                        {renderFile('test_redis_cache.py', 'tests/integration/test_redis_cache.py', 3)}
                        {renderFile('test_postgres_db.py', 'tests/integration/test_postgres_db.py', 3)}
                        {renderFile('test_s3_storage.py', 'tests/integration/test_s3_storage.py', 3)}
                        {renderFile('test_datadog_metrics.py', 'tests/integration/test_datadog_metrics.py', 3)}
                        {renderFile('test_sendgrid.py', 'tests/integration/test_sendgrid.py', 3)}
                        {renderFile('test_twilio.py', 'tests/integration/test_twilio.py', 3)}
                        {renderFile('test_slack_bot.py', 'tests/integration/test_slack_bot.py', 3)}
                      </>
                    ))}
                    {renderFolder('e2e', 'tests/e2e', 2, (
                      <>
                        {renderFile('test_full_checkout_flow.py', 'tests/e2e/test_full_checkout_flow.py', 3)}
                        {renderFile('test_subscription_renewal_flow.py', 'tests/e2e/test_subscription_renewal_flow.py', 3)}
                        {renderFile('test_refund_flow.py', 'tests/e2e/test_refund_flow.py', 3)}
                        {renderFile('test_fraud_rejection_flow.py', 'tests/e2e/test_fraud_rejection_flow.py', 3)}
                        {renderFile('test_invoice_generation_flow.py', 'tests/e2e/test_invoice_generation_flow.py', 3)}
                      </>
                    ))}
                  </>
                ))}

                {renderFile('conftest.py', 'conftest.py', 1)}
                {renderFile('pytest.ini', 'pytest.ini', 1, { iconColor: '#ccc' })}
              </>
            ))}
          </div>
        </div>

        {/* Resizer */}
        <div 
          onMouseDown={handleSidebarMouseDown}
          style={{
            width: 4,
            backgroundColor: '#333',
            cursor: 'col-resize',
            zIndex: 10,
            flexShrink: 0,
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007acc')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#333')}
        />

        {/* Code editor area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#1e1e1e' }}>
          {step === '2' && (
          <div style={{
            background: 'rgba(240, 68, 56, 0.1)',
            borderBottom: '1px solid rgba(240, 68, 56, 0.3)',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <XCircle size={15} style={{ color: 'var(--red)' }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, fontSize: 12, color: 'var(--red-text)' }}>Auracle Gate: FAIL (PR #184)</span>
              <span style={{ fontSize: 12, color: '#ccc', marginLeft: 10 }}>
                1 test FAILED · 1 material gap
              </span>
            </div>
            <button className="btn btn-danger" style={{ fontSize: 11, padding: '4px 8px' }} onClick={() => navigate('/pull-requests/184/report')}>View Report</button>
          </div>
          )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', backgroundColor: '#2d2d2d', height: 35 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#1e1e1e', padding: '0 16px', borderTop: '1px solid #4f7fff' }}>
                <File size={14} color="#4f7fff" />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: '#fff' }}>{activeFile.split('/').pop()}</span>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              {fileContents[activeFile] ? fileContents[activeFile].map((line, i) => (
                <div
                  key={i}
                  className={`code-line${line.cov === 'covered' ? ' covered' : line.cov === 'uncovered' ? ' uncovered' : ''}`}
                  style={{ background: line.changed && !line.cov ? 'rgba(79,127,255,0.04)' : undefined }}
                >
                  <div className="code-line-number">{line.n}</div>
                  <div className="code-line-gutter" style={{ width: 28 }}>
                    {line.cov === 'covered' && <div className="coverage-dot covered" />}
                    {line.cov === 'uncovered' && <div className="coverage-dot uncovered" />}
                    {line.changed && !line.cov && <div style={{ width: 3, height: 16, background: 'var(--accent-dim)', borderRadius: 1 }} />}
                  </div>
                  <div 
                    className="code-line-content" 
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleLineChange(activeFile, i, e.currentTarget.textContent?.replace(line.t || '', '') || '')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault(); // Prevent adding divs/brs inside the line
                      }
                    }}
                    style={{ 
                      color: step === '2' && line.cov === 'uncovered' ? '#ff9999' : '#d4d4d4',
                      outline: 'none',
                      whiteSpace: 'pre'
                    }}
                  >
                    {line.changed && <span contentEditable={false} style={{ color: 'rgba(79,127,255,0.8)', marginRight: 2, fontSize: 12 }}>+</span>}
                    {line.t}{line.c || ' '}
                  </div>
                  {activeFile === 'src/payments/service.py' && step === '2' && line.n === 143 && (
                    <div style={{
                      position: 'absolute',
                      right: 8,
                      background: 'var(--red-dim)',
                      border: '1px solid #4a1515',
                      borderRadius: 4,
                      padding: '1px 6px',
                      fontSize: 10,
                      color: 'var(--red-text)',
                      fontFamily: 'var(--font-mono)',
                      zIndex: 10,
                      pointerEvents: 'none'
                    }}>
                      ⚠ MATERIAL GAP · Evidence: COV-184-12
                    </div>
                  )}
                </div>
              )) : (
                <div style={{ padding: 20, color: '#888', fontStyle: 'italic', fontFamily: 'sans-serif' }}>
                  Select a file from the explorer to view its contents.
                </div>
              )}
            </div>
          </div>

          {/* Terminal Resizer */}
          <div 
            onMouseDown={handleTerminalMouseDown}
            style={{
              height: 4,
              backgroundColor: '#333',
              cursor: 'row-resize',
              zIndex: 10,
              flexShrink: 0,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007acc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#333')}
          />

          {/* Terminal */}
          <div style={{ height: terminalHeight, display: 'flex', flexDirection: 'column', flexShrink: 0, backgroundColor: '#1e1e1e' }}>
            <div style={{ padding: '0 16px', display: 'flex', alignItems: 'center', gap: 20, borderBottom: '1px solid #333', fontSize: 12, textTransform: 'uppercase', height: 35 }}>
              <span style={{ color: '#ccc', borderBottom: '1px solid #ccc', paddingBottom: 8, transform: 'translateY(4.5px)' }}>Terminal</span>
              <span style={{ color: '#888' }}>Output</span>
              <span style={{ color: '#888' }}>Problems</span>
              <div style={{ marginLeft: 'auto', fontSize: 11, color: '#888', textTransform: 'none' }}>
                {step === '1' ? "Type 'git commit' and 'git push' to start the journey." : "Fix the test (or click Apply Fix in Copilot), then 'git push'."}
              </div>
            </div>
            <div style={{ padding: '12px 16px', flex: 1, overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: 13, color: '#cccccc', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {terminalOutput.map((out, idx) => (
                <div key={idx} style={{ whiteSpace: 'pre-wrap' }}>{out}</div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>mayachen@MacBook-Pro payments-api %</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleCommand}
                  style={{ background: 'transparent', border: 'none', color: '#fff', flex: 1, outline: 'none', fontFamily: 'inherit', fontSize: 'inherit' }}
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>

        {/* Side panel for Step 2 */}
        {step === '2' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320, flexShrink: 0, overflowY: 'auto', backgroundColor: '#252526', borderLeft: '1px solid #333', padding: 16 }}>
          {/* Auracle Copilot mini */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Bot size={13} style={{ color: '#c9a8ff' }} />
                <span className="card-title">Auracle Copilot</span>
              </div>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 10 }}>
                The retry exhaustion branch (lines 143-145) has zero coverage after all 24 selected tests executed.{' '}
                <span style={{ color: 'var(--yellow-text)' }}>RetryExhaustedException</span> is raised here, but no test exercises this path.
              </div>
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 16 }}>
                <div className="evidence-chip">COV-184-12</div>
                <div className="evidence-chip">GATE-184-14</div>
              </div>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '6px 0', fontSize: 12, opacity: isTyping ? 0.6 : 1 }}
                onClick={simulateTyping}
                disabled={isTyping}
              >
                {isTyping ? 'Generating...' : 'Apply Fix (Simulate Developer)'}
              </button>
            </div>
          </div>

          {/* Quick test results */}
          <div className="card">
            <div className="card-header"><span className="card-title">Selected Tests</span></div>
            <div style={{ padding: 0 }}>
              {[
                { name: 'test_refund_failure', result: 'FAIL', reason: 'Direct · exc before return' },
                { name: 'test_refund_success', result: 'PASS', reason: 'Direct coverage' },
                { name: 'test_refund_duplicate', result: 'PASS', reason: 'Guard logic' },
                { name: 'test_gateway_retry', result: 'PASS', reason: 'Retry loop' },
                { name: 'test_ledger_write', result: 'PASS', reason: 'Ledger path' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
                  {t.result === 'PASS'
                    ? <CheckCircle size={12} style={{ color: 'var(--green)', flexShrink: 0 }} />
                    : <XCircle size={12} style={{ color: 'var(--red)', flexShrink: 0 }} />
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: t.result === 'FAIL' ? 'var(--red-text)' : 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t.reason}</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '6px 12px', fontSize: 10, color: 'var(--text-muted)' }}>
                +19 more selected · 3 not-selected hidden
              </div>
            </div>
          </div>

          {/* Evidence in editor */}
          <div className="card">
            <div className="card-header"><span className="card-title">Quick Evidence</span></div>
            <div style={{ padding: '10px 12px' }}>
              {[
                { id: 'CHG-184-01', desc: 'Diff observed by Auracle', ok: true },
                { id: 'IMP-184-05', desc: '42 tests reachable via graph', ok: true },
                { id: 'PRED-184-09', desc: '24 tests selected (v0.6.3)', ok: true },
                { id: 'EXEC-184-11', desc: 'test_refund_failure FAILED', ok: false },
                { id: 'COV-184-12', desc: 'Retry branch uncovered', ok: false },
                { id: 'GATE-184-14', desc: 'Gate: FAIL', ok: false },
              ].map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: e.ok ? 'var(--green)' : 'var(--red)', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent)', width: 100 }}>{e.id}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{e.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Floating Demo Blob */}
      <div 
        onClick={isAutoPlaying ? togglePause : playJourney}
        style={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: isPaused ? '#f5a623' : '#60a5fa',
          boxShadow: '0 4px 15px rgba(96, 165, 250, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          opacity: 1,
          transform: 'scale(1)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.backgroundColor = isPaused ? '#d97706' : '#3b82f6'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = isPaused ? '#f5a623' : '#60a5fa'; }}
        title={isAutoPlaying ? (isPaused ? "Resume Journey" : "Pause Journey") : "Play Ahmed's Journey"}
      >
        {isAutoPlaying && !isPaused ? (
          <Pause fill="white" color="white" size={20} />
        ) : (
          <Play fill="white" color="white" size={20} style={{ marginLeft: 2 }} />
        )}
      </div>
    </div>
  )
}
