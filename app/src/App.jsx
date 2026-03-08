import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { skills, categories, connections } from './data.js';

function SkillModal({ skillId, onSelect, onClose }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const skill = skills.find(s => s.id === skillId);
  if (!skill) return null;

  const cat = categories[skill.category];
  const connectedSkills = skill.connections
    .map(id => skills.find(s => s.id === id))
    .filter(Boolean);

  return (
    <div className="modal-overlay" ref={overlayRef}>
      <div className="modal" ref={modalRef}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h3>{skill.name}</h3>
        <div className="modal-category">
          {skill.category}
          {skill.pipelineOrder && ` / Step ${skill.pipelineOrder}`}
        </div>
        <p className="modal-desc">{skill.description}</p>

        <div className="modal-section">
          <h4>Invoke</h4>
          <div className="modal-invoke">/{skill.id}</div>
        </div>

        <div className="modal-section">
          <h4>Output</h4>
          <div className="modal-output">{skill.output}</div>
        </div>

        <div className="modal-section">
          <h4>Mode</h4>
          <div className={`modal-mode ${skill.invocation}`}>
            {skill.invocation === 'manual' ? 'Manual only (costs API credits or has side effects)' : 'Auto + Manual'}
          </div>
        </div>

        <div className="modal-section">
          <h4>Install Path</h4>
          <div className="modal-invoke">skills/{cat.slug}/{skill.id}/SKILL.md</div>
        </div>

        {connectedSkills.length > 0 && (
          <div className="modal-section">
            <h4>Connections ({connectedSkills.length})</h4>
            <div className="modal-connections">
              {connectedSkills.map(cs => (
                <button
                  key={cs.id}
                  className="conn-btn"
                  onClick={() => onSelect(cs.id)}
                >
                  {cs.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="modal-section">
          <h4>Tags</h4>
          <div className="modal-tags">
            {skill.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineFlow({ onSelect }) {
  const gtmSkills = skills
    .filter(s => s.category === 'GTM Pipeline')
    .sort((a, b) => (a.pipelineOrder || 0) - (b.pipelineOrder || 0));

  return (
    <div className="pipeline-section">
      <div className="category-header">
        <h2>GTM Pipeline</h2>
        <span className="count">17 steps</span>
      </div>
      <p className="category-desc">Full outbound pipeline from campaign context to closed-loop feedback. Each step feeds the next.</p>
      <div className="pipeline-scroll">
        <div className="pipeline-flow">
          {gtmSkills.map((skill, i) => (
            <React.Fragment key={skill.id}>
              <button
                className="pipeline-step"
                onClick={() => onSelect(skill.id)}
              >
                <div className="step-num">Step {skill.pipelineOrder}</div>
                <div className="step-name">{skill.name}</div>
                <div className="step-output">{skill.output}</div>
                <div className="step-badges">
                  {skill.invocation === 'manual' && <span className="badge manual">manual</span>}
                </div>
              </button>
              {i < gtmSkills.length - 1 && <div className="pipeline-arrow">&rarr;</div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryGrid({ category, catData, skills: catSkills, onSelect }) {
  return (
    <div className="category-section">
      <div className="category-header">
        <h2>{category}</h2>
        <span className="count">{catSkills.length} skills</span>
      </div>
      <p className="category-desc">{catData.description}</p>
      <div className="skill-grid">
        {catSkills.map(skill => (
          <button key={skill.id} className="skill-card" onClick={() => onSelect(skill.id)}>
            <div className="skill-name">{skill.name}</div>
            <div className="skill-output">{skill.output}</div>
            <div className="skill-badges">
              {skill.invocation === 'manual' && <span className="badge manual">manual</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const filteredSkills = useMemo(() => {
    let result = skills;
    if (activeCategory) result = result.filter(s => s.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q))
      );
    }
    return result;
  }, [activeCategory, search]);

  const handleSelect = useCallback((id) => {
    setSelected(id);
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  const totalSkills = skills.length;
  const manualSkills = skills.filter(s => s.invocation === 'manual').length;
  const autoSkills = totalSkills - manualSkills;
  const categoryCount = Object.keys(categories).length;

  const nonGtmCategories = Object.entries(categories).filter(([name]) => name !== 'GTM Pipeline');

  const showGtm = !activeCategory || activeCategory === 'GTM Pipeline';
  const gtmMatchesSearch = !search || skills
    .filter(s => s.category === 'GTM Pipeline')
    .some(s => {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q));
    });

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        <h1>{totalSkills} Claude Code skills for growth marketing. Open source.</h1>
        <p className="hero-byline">
          I built these while running growth at a Series B data company.
          They cover the full stack: outbound pipeline, SEO, content,
          paid ads, conversion, video, and design.
        </p>
        <div className="hero-stats">
          <div className="hero-stat"><strong>{totalSkills}</strong>Skills</div>
          <div className="hero-stat"><strong>{categoryCount}</strong>Categories</div>
          <div className="hero-stat"><strong>{autoSkills}</strong>Auto-invoke</div>
          <div className="hero-stat"><strong>{manualSkills}</strong>Manual-only</div>
          <div className="hero-stat"><strong>{connections.length}</strong>Connections</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
          className={`filter-btn ${!activeCategory ? 'active' : ''}`}
          onClick={() => setActiveCategory(null)}
        >
          All<span className="count">{totalSkills}</span>
        </button>
        {Object.entries(categories).map(([name, cat]) => (
          <button
            key={name}
            className={`filter-btn ${activeCategory === name ? 'active' : ''}`}
            onClick={() => setActiveCategory(activeCategory === name ? null : name)}
          >
            {name}<span className="count">{cat.count}</span>
          </button>
        ))}
      </div>

      {/* GTM Pipeline (special horizontal flow) */}
      {showGtm && gtmMatchesSearch && (
        <PipelineFlow onSelect={handleSelect} />
      )}

      {/* Category grids */}
      {nonGtmCategories.map(([name, catData]) => {
        if (activeCategory && activeCategory !== name) return null;
        const catSkills = filteredSkills.filter(s => s.category === name);
        if (catSkills.length === 0) return null;
        return (
          <CategoryGrid
            key={name}
            category={name}
            catData={catData}
            skills={catSkills}
            onSelect={handleSelect}
          />
        );
      })}

      {/* How to Install */}
      <div className="install-section">
        <h2>Quick Start</h2>
        <p>Clone the repo and copy skills into your Claude Code configuration directory.</p>
        <div className="code-block">
          <span className="comment"># Clone the repo</span>{'\n'}
          git clone https://github.com/dr-growth/claude-code-growth-skills.git{'\n'}
          {'\n'}
          <span className="comment"># Copy all skills to your Claude skills directory</span>{'\n'}
          cp -r claude-code-growth-skills/skills/* ~/.claude/skills/{'\n'}
          {'\n'}
          <span className="comment"># Or copy a specific category</span>{'\n'}
          cp -r claude-code-growth-skills/skills/seo/* ~/.claude/skills/{'\n'}
          {'\n'}
          <span className="comment"># Or use the install script</span>{'\n'}
          ./claude-code-growth-skills/install.sh
        </div>
      </div>

      {/* Best Practices */}
      <div className="practices-section">
        <h2>Best Practices</h2>
        <div className="practice-grid">
          <div className="practice-card">
            <h4>SKILL.md Format</h4>
            <p>Every skill uses Anthropic's standard format: YAML frontmatter with name and description, followed by markdown instructions. Claude reads these automatically.</p>
          </div>
          <div className="practice-card">
            <h4>Auto vs Manual</h4>
            <p>Most skills auto-invoke when Claude detects a matching request. Manual skills have disable-model-invocation: true because they cost API credits or write to external systems.</p>
          </div>
          <div className="practice-card">
            <h4>Safety Gates</h4>
            <p>7 skills are manual-only: list enrichment, people search, email search, email generation, campaign sending, CRM sync, and content publishing. These spend money or publish externally.</p>
          </div>
          <div className="practice-card">
            <h4>Connections</h4>
            <p>Skills reference each other. The GTM pipeline is sequential (step 1 feeds step 2), while other skills connect freely based on workflow.</p>
          </div>
          <div className="practice-card">
            <h4>Customize</h4>
            <p>Fork and edit any SKILL.md to match your product, voice, and workflow. Replace generic placeholders with your company-specific context.</p>
          </div>
          <div className="practice-card">
            <h4>Contribute</h4>
            <p>PRs welcome. Follow the existing SKILL.md format. Include a clear description trigger so Claude knows when to auto-invoke your skill.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <span>Built by David Ronen</span>
        <div className="footer-links">
          <a href="https://github.com/dr-growth/claude-code-growth-skills" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://davidronen.com" target="_blank" rel="noopener noreferrer">davidronen.com</a>
          <a href="https://linkedin.com/in/davidjronen" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </footer>

      {/* Modal */}
      {selected && (
        <SkillModal
          skillId={selected}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
