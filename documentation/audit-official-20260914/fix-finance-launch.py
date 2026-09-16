from pathlib import Path
p=Path('src/skill-workshop.js');backup=Path('documentation/audit-official-20260914/before-fixes/src/skill-workshop.js');backup.write_bytes(p.read_bytes())
s=p.read_text(encoding='utf-8').replace("if(typeof recordTransaction==='function')recordTransaction('Formation VJ',-cost,skill.label);", "recordFinance(-cost,`Formation VJ · ${skill.label}`);");p.write_text(s,encoding='utf-8')
p=Path('tools/Lancer-VJ-Simulator.ps1');s=p.read_text(encoding='utf-8-sig');s=s.replace("$pythonPath =", "$expectedMain = [System.IO.File]::ReadAllText((Join-Path $projectPath 'src/main.js'))\n$pythonPath =",1);s=s.replace('return $page.Content.Replace("`r`n", "`n") -ceq $expectedIndex.Replace("`r`n", "`n")', '''if ($page.Content.Replace("`r`n", "`n") -cne $expectedIndex.Replace("`r`n", "`n")) { return $false }
        $main = Invoke-WebRequest -Uri ($Address + 'src/main.js') -UseBasicParsing -TimeoutSec 2
        return $main.Content.Replace("`r`n", "`n") -ceq $expectedMain.Replace("`r`n", "`n")''');p.write_text(s,encoding='utf-8-sig')
