import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from "react";

type View = "dashboard" | "configuration" | "servers";
type Theme = "light" | "dark";
type Machine = {
  name: string;
  specs: string;
  ip: string;
  region: string;
  city: string;
  traffic: number;
};

const A = "/assets";

const machines: Machine[] = [
  {
    name: "web-prod-01",
    specs: "4 vCPU · 8 GB RAM",
    ip: "192.0.2.10",
    region: "US East",
    city: "Virginia",
    traffic: 42.8,
  },
  {
    name: "web-prod-02",
    specs: "4 vCPU · 8 GB RAM",
    ip: "192.0.2.11",
    region: "US East",
    city: "Virginia",
    traffic: 38.6,
  },
  {
    name: "db-primary-01",
    specs: "8 vCPU · 16 GB RAM",
    ip: "198.51.100.20",
    region: "EU Central",
    city: "Frankfurt",
    traffic: 21.2,
  },
  {
    name: "db-replica-01",
    specs: "2 vCPU · 4 GB RAM",
    ip: "198.51.100.21",
    region: "EU Central",
    city: "Frankfurt",
    traffic: 17.4,
  },
  {
    name: "api-prod-01",
    specs: "4 vCPU · 8 GB RAM",
    ip: "192.0.2.30",
    region: "US East",
    city: "Virginia",
    traffic: 36.5,
  },
  {
    name: "worker-prod-01",
    specs: "2 vCPU · 4 GB RAM",
    ip: "192.0.2.40",
    region: "US East",
    city: "Virginia",
    traffic: 28.1,
  },
  {
    name: "cache-prod-01",
    specs: "4 vCPU · 8 GB RAM",
    ip: "198.51.100.50",
    region: "EU Central",
    city: "Frankfurt",
    traffic: 74.2,
  },
  {
    name: "edge-ap-01",
    specs: "4 vCPU · 8 GB RAM",
    ip: "203.0.113.60",
    region: "Asia Pacific",
    city: "Singapore",
    traffic: 54,
  },
];

const icons = {
  dashboard: { active: `${A}/92493.svg`, idle: `${A}/018e2.svg` },
  configuration: { active: `${A}/8b95c.svg`, idle: `${A}/88bb7.svg` },
  servers: { active: `${A}/ba73c.svg`, idle: `${A}/b5774.svg` },
};

type DesignButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingOnClick?: boolean;
};

function DesignButton({
  loading = false,
  loadingOnClick = true,
  disabled,
  children,
  className = "",
  type = "button",
  onClick,
  ...props
}: DesignButtonProps) {
  const [transientLoading, setTransientLoading] = useState(false);
  const loadingTimer = useRef<number | null>(null);
  const busy = loading || transientLoading;

  useEffect(
    () => () => {
      if (loadingTimer.current) window.clearTimeout(loadingTimer.current);
    },
    [],
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented && loadingOnClick) {
      setTransientLoading(true);
      loadingTimer.current = window.setTimeout(() => setTransientLoading(false), 800);
    }
  };

  return (
    <button
      {...props}
      type={type}
      className={`design-button ${className}`.trim()}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      onClick={handleClick}
    >
      {busy && <span className="button-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

function Logo({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className="logo">
      <img src={`${A}/${mobile ? "4d81e" : "91383"}.svg`} alt="" />
      <strong>stratus</strong>
    </div>
  );
}

function StatusPill() {
  return (
    <span className="system-status">
      <i /> All systems operational
    </span>
  );
}

function ThemeSwitch({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  const dark = theme === "dark";

  return (
    <DesignButton
      className="theme-switch"
      role="switch"
      aria-checked={dark}
      aria-label={`Dark mode ${dark ? "on" : "off"}`}
      loadingOnClick={false}
      onClick={() => onChange(dark ? "light" : "dark")}
    >
      <span>Dark mode</span>
      <span className="theme-switch-track" aria-hidden="true">
        <img src={`${A}/facb3.svg`} alt="" />
        <i />
      </span>
    </DesignButton>
  );
}

function Navigation({
  view,
  setView,
  mobile = false,
}: {
  view: View;
  setView: (view: View) => void;
  mobile?: boolean;
}) {
  const [loadingView, setLoadingView] = useState<View | null>(null);
  const labels: { id: View; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "configuration", label: "Configuration" },
    { id: "servers", label: "Servers" },
  ];
  return (
    <nav className={mobile ? "bottom-nav" : "side-nav"} aria-label="Primary navigation">
      {labels.map(({ id, label }) => (
        <DesignButton
          key={id}
          className={view === id ? "active" : ""}
          loading={loadingView === id}
          onClick={() => {
            if (id === view) return;
            setLoadingView(id);
            window.setTimeout(() => {
              setView(id);
              setLoadingView(null);
            }, 300);
          }}
        >
          <img src={icons[id][view === id ? "active" : "idle"]} alt="" />
          <span>{label}</span>
          {!mobile && id === "servers" && <b>8</b>}
        </DesignButton>
      ))}
    </nav>
  );
}

function Sidebar({ view, setView }: { view: View; setView: (view: View) => void }) {
  return (
    <aside className="sidebar">
      <Logo />
      <div className="profile">
        <img src={`${A}/fef45.png`} alt="Alex Morgan" />
        <strong>Alex Morgan</strong>
        <span>Workspace admin</span>
        <img className="chevron" src={`${A}/851f9.svg`} alt="" />
      </div>
      <div className="divider" />
      <p className="sidebar-label">WORKSPACE</p>
      <Navigation view={view} setView={setView} />
      <div className="plan-card">
        <span>PRO WORKSPACE</span>
        <strong>Room to grow.</strong>
        <small>8 of 20 machines used</small>
        <div className="progress">
          <i style={{ width: "40%" }} />
        </div>
        <DesignButton>
          Manage plan <img src={`${A}/e47a2.svg`} alt="" />
        </DesignButton>
      </div>
      <div className="sidebar-footer">
        <p>
          <img src={`${A}/53cce.svg`} alt="" /> Help &amp; documentation
        </p>
        <small>Stratus Cloud&nbsp; / &nbsp;v.2.8</small>
      </div>
    </aside>
  );
}

function MobileHeader({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  return (
    <header className="mobile-header">
      <Logo mobile />
      <ThemeSwitch theme={theme} onChange={setTheme} />
      <img className="mobile-avatar" src={`${A}/2399c.png`} alt="Alex Morgan" />
      <span>Acme production</span>
      <StatusPill />
    </header>
  );
}

function DesktopHeader({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  return (
    <header className="desktop-header">
      <div>
        <span>Workspace</span>
        <i>/</i>
        <strong>Acme production</strong>
        <img src={`${A}/556ed.svg`} alt="" />
      </div>
      <ThemeSwitch theme={theme} onChange={setTheme} />
      <StatusPill />
      <img className="bell" src={`${A}/12658.svg`} alt="Notifications" />
    </header>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      <span>{description}</span>
      {action}
    </div>
  );
}

function MetricCard({
  label,
  value,
  detail,
  trend,
}: {
  label: string;
  value: string;
  detail: string;
  trend: string;
}) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
      <em>{trend}</em>
    </article>
  );
}

function NetworkChart() {
  return (
    <article className="card network-card">
      <h2>Network traffic</h2>
      <span>
        Inbound and outbound<span className="desktop-only"> across your machines</span>
      </span>
      <DesignButton className="chart-range">
        Last 24 hours<span className="desktop-only">⌄</span>
      </DesignButton>
      <div className="chart-area">
        <div className="y-labels">
          <span>90 GB</span>
          <span>60 GB</span>
          <span>30 GB</span>
          <span>0 GB</span>
        </div>
        <div className="grid-lines">
          <i />
          <i />
          <i />
          <i />
        </div>
        <picture>
          <source media="(max-width: 767px)" srcSet={`${A}/b8476.svg`} />
          <img src={`${A}/56a39.svg`} alt="Inbound and outbound traffic over the last 24 hours" />
        </picture>
        <div className="x-labels">
          <span>00:00</span>
          <span className="desktop-only">04:00</span>
          <span>08:00</span>
          <span className="desktop-only">12:00</span>
          <span>16:00</span>
          <span className="desktop-only">20:00</span>
          <span>23:59</span>
        </div>
      </div>
      <div className="chart-legend">
        <span>
          <i />
          Inbound
        </span>
        <span>
          <i />
          Outbound
        </span>
      </div>
    </article>
  );
}

function RegionsCard() {
  const regions = [
    ["US East", "Virginia · us-east-1", "4 machines", "52%"],
    ["EU Central", "Frankfurt · eu-central-1", "3 machines", "39%"],
    ["Asia Pacific", "Singapore · ap-southeast-1", "1 machine", "13%"],
  ];
  return (
    <article className="card regions-card">
      <h2>Deployment regions</h2>
      <span>8 machines · 3 regions</span>
      {regions.map(([name, city, count, width]) => (
        <div className="region" key={name}>
          <strong>{name}</strong>
          <small>{city}</small>
          <em>{count}</em>
          <div className="progress">
            <i style={{ width }} />
          </div>
        </div>
      ))}
    </article>
  );
}

function MachinePulse({ setView }: { setView: (view: View) => void }) {
  return (
    <article className="card pulse-card">
      <h2>Machines</h2>
      <span>A pulse check on your infrastructure.</span>
      <DesignButton className="view-all" onClick={() => setView("servers")}>
        View all <span className="desktop-only">machines</span> →
      </DesignButton>
      <div className="pulse-header">
        <span>MACHINE</span>
        <span>STATUS</span>
        <span>REGION</span>
        <span>CPU USAGE</span>
        <span>MEMORY</span>
        <span>TRAFFIC / 24H</span>
      </div>
      {machines.slice(0, 3).map((machine, index) => (
        <div className="pulse-row" key={machine.name}>
          <div>
            <b>≡</b>
            <strong>{machine.name}</strong>
            <small>{machine.specs}</small>
          </div>
          <StatusBadge />
          <span>
            {machine.region} · {machine.city}
          </span>
          <span>
            {[34, 41, 62][index]}%{" "}
            <i className="mini-progress">
              <b style={{ width: `${[34, 41, 62][index]}%` }} />
            </i>
          </span>
          <span>{["3.2 / 8 GB", "3.8 / 8 GB", "11.4 / 16 GB"][index]}</span>
          <span>{machine.traffic.toFixed(1)} GB</span>
        </div>
      ))}
    </article>
  );
}

function Dashboard({ setView }: { setView: (view: View) => void }) {
  return (
    <div className="page dashboard-page">
      <PageHeading
        eyebrow="OVERVIEW"
        title="Your cloud, at a glance."
        description="A little less complexity. A lot more control."
        action={<DesignButton className="primary page-action">+&nbsp; Create machine</DesignButton>}
      />
      <section className="metrics-grid">
        <MetricCard
          label="Active machines"
          value="8"
          detail="of 20 available"
          trend="All running"
        />
        <MetricCard
          label="vCPU utilization"
          value="42.8%"
          detail="across 32 vCPUs"
          trend="↓ 6.2%"
        />
        <MetricCard
          label="Network traffic"
          value="1.24 TB"
          detail="this billing period"
          trend="↑ 12.4%"
        />
        <MetricCard
          label="Estimated cost"
          value="$284.60"
          detail="of $400 monthly budget"
          trend="On track"
        />
      </section>
      <section className="dashboard-middle">
        <NetworkChart />
        <RegionsCard />
      </section>
      <MachinePulse setView={setView} />
      <div className="sync-line">
        <span>Last synced just now</span>
        <span>All times are in UTC</span>
      </div>
    </div>
  );
}

function StatusBadge() {
  return (
    <span className="running">
      <i />
      Running
    </span>
  );
}

function ResetButton({ onComplete }: { onComplete?: () => void }) {
  const [loading, setLoading] = useState(false);
  const reset = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onComplete?.();
    }, 700);
  };

  return (
    <DesignButton className="outline reset" loading={loading} onClick={reset}>
      <picture>
        <source media="(max-width: 767px)" srcSet={`${A}/df5eb.svg`} />
        <img src={`${A}/5e5d7.svg`} alt="" />
      </picture>
      Reset
    </DesignButton>
  );
}

function Field({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options?: string[];
  onChange?: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {options ? (
        <select value={value} onChange={(e) => onChange?.(e.target.value)}>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input value={value} onChange={(e) => onChange?.(e.target.value)} />
      )}
    </label>
  );
}

const plans = [
  { name: "Starter", cpu: "2 vCPU", ram: "4 GB RAM", price: "$24", hourly: "$0.0333" },
  { name: "Standard", cpu: "4 vCPU", ram: "8 GB RAM", price: "$48", hourly: "$0.0667" },
  { name: "Performance", cpu: "8 vCPU", ram: "16 GB RAM", price: "$96", hourly: "$0.1333" },
];

function Configuration() {
  const [machineName, setMachineName] = useState("web-prod-01");
  const [environment, setEnvironment] = useState("Production");
  const [region, setRegion] = useState("US East · Virginia (us-east-1)");
  const [os, setOs] = useState("Ubuntu 24.04 LTS");
  const [ssh, setSsh] = useState("alex-macbook-pro");
  const [plan, setPlan] = useState(1);
  const [message, setMessage] = useState("No unsaved changes");
  const [saving, setSaving] = useState(false);
  const selected = plans[plan];
  const hasUnsavedChanges = message === "Unsaved changes";
  const dirty = () => setMessage("Unsaved changes");
  const update = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    dirty();
  };
  const discard = () => {
    setMachineName("web-prod-01");
    setEnvironment("Production");
    setRegion("US East · Virginia (us-east-1)");
    setOs("Ubuntu 24.04 LTS");
    setSsh("alex-macbook-pro");
    setPlan(1);
    setMessage("Changes discarded");
  };
  return (
    <div className="page configuration-page">
      <PageHeading
        eyebrow="MACHINE SETTINGS"
        title="Configuration"
        description="Fine-tune your machine. Keep your infrastructure in balance."
      />
      <div className="machine-selector">
        <b>SELECT MACHINE</b>
        <select>
          <option>web-prod-01</option>
          <option>web-prod-02</option>
          <option>db-primary-01</option>
        </select>
      </div>
      <div className="desktop-config-tools">
        <ResetButton onComplete={() => setMessage("Restart requested")} />
        <select>
          <option>web-prod-01</option>
          <option>web-prod-02</option>
        </select>
      </div>
      <div className="tabs">
        <DesignButton className="active">General</DesignButton>
        <DesignButton>Networking</DesignButton>
        <DesignButton>Security</DesignButton>
        <DesignButton>Backups</DesignButton>
      </div>
      <section className="mobile-cost card">
        <span>Estimated monthly cost</span>
        <StatusBadge />
        <strong>{selected.price}.00</strong>
        <small>/ month</small>
        <b>
          {selected.cpu} / {selected.ram}
        </b>
        <em>80 GB NVMe SSD</em>
        <ResetButton onComplete={() => setMessage("Restart requested")} />
      </section>
      <div className="config-layout">
        <section className="card config-form">
          <h2>Machine details</h2>
          <p>The basics that keep everything running.</p>
          <div className="fields-grid">
            <Field label="Machine name" value={machineName} onChange={update(setMachineName)} />
            <Field
              label="Environment"
              value={environment}
              options={["Production", "Staging", "Development"]}
              onChange={update(setEnvironment)}
            />
            <Field
              label="Region"
              value={region}
              options={[
                "US East · Virginia (us-east-1)",
                "EU Central · Frankfurt",
                "Asia Pacific · Singapore",
              ]}
              onChange={update(setRegion)}
            />
            <Field
              label="Operating system"
              value={os}
              options={["Ubuntu 24.04 LTS", "Ubuntu 22.04 LTS", "Debian 12"]}
              onChange={update(setOs)}
            />
          </div>
          <div className="form-section resources">
            <h2>Compute resources</h2>
            <p>Choose the right size for your workload.</p>
            <div className="plan-grid">
              {plans.map((item, index) => (
                <DesignButton
                  key={item.name}
                  className={plan === index ? "selected" : ""}
                  onClick={() => {
                    setPlan(index);
                    dirty();
                  }}
                >
                  <b>{item.name}</b>
                  <strong>{item.cpu}</strong>
                  <span>{item.ram}</span>
                  <em>{item.price} / mo</em>
                </DesignButton>
              ))}
            </div>
          </div>
          <div className="form-section storage">
            <h2>Storage &amp; access</h2>
            <div className="storage-fields">
              <Field label="SSD storage" value="80 GB" onChange={dirty} />
              <Field
                label="SSH key"
                value={ssh}
                options={["alex-macbook-pro", "production-deploy-key", "backup-key"]}
                onChange={update(setSsh)}
              />
            </div>
            <div className="field-help">
              <span>Encrypted NVMe storage</span>
              <span>Your key is securely attached to this machine.</span>
            </div>
          </div>
        </section>
        <aside className="config-aside">
          <section className="card config-summary">
            <h2>Your configuration</h2>
            <StatusBadge />
            <b>{machineName}</b>
            <dl>
              <dt>Region</dt>
              <dd>US East · Virginia</dd>
              <dt>Image</dt>
              <dd>{os}</dd>
              <dt>Compute</dt>
              <dd>
                {selected.cpu} / {selected.ram}
              </dd>
              <dt>Storage</dt>
              <dd>80 GB NVMe SSD</dd>
              <dt>Bandwidth</dt>
              <dd>4 TB included</dd>
            </dl>
            <div className="cost">
              <span>Estimated monthly cost</span>
              <strong>{selected.price}.00</strong>
              <small>/ month</small>
              <em>Billed hourly at {selected.hourly} / hour</em>
            </div>
          </section>
          <section className="notice">
            <strong>A heads-up before you save</strong>
            <p>
              Changing compute resources requires a restart. Your machine’s IP and stored data will
              stay the same.
            </p>
          </section>
        </aside>
      </div>
      <div className="config-actions">
        <span>{message}</span>
        <DesignButton className="outline" disabled={!hasUnsavedChanges || saving} onClick={discard}>
          Discard
        </DesignButton>
        <DesignButton
          className="primary"
          disabled={!hasUnsavedChanges}
          loading={saving}
          onClick={() => {
            setMessage("Saving configuration…");
            setSaving(true);
            window.setTimeout(() => {
              setSaving(false);
              setMessage("Configuration saved");
            }, 700);
          }}
        >
          Save changes
        </DesignButton>
      </div>
    </div>
  );
}

function ServerActions({
  name,
  onEdit,
  onStop,
  stopped,
}: {
  name: string;
  onEdit: () => void;
  onStop: () => void;
  stopped: boolean;
}) {
  const [pendingAction, setPendingAction] = useState<"reset" | "edit" | "stop" | null>(null);
  const runAction =
    (
      action: "reset" | "edit" | "stop",
      callback?: (event: MouseEvent<HTMLButtonElement>) => void,
    ) =>
    (event: MouseEvent<HTMLButtonElement>) => {
      setPendingAction(action);
      window.setTimeout(() => {
        callback?.(event);
        setPendingAction(null);
      }, 600);
    };

  return (
    <div className="server-actions">
      <ResetButton />
      <DesignButton
        className="outline"
        loading={pendingAction === "edit"}
        onClick={runAction("edit", onEdit)}
      >
        <img className="desktop-only" src={`${A}/482c0.svg`} alt="" />
        Edit
      </DesignButton>
      <DesignButton
        className="outline danger"
        loading={pendingAction === "stop"}
        onClick={runAction("stop", onStop)}
      >
        <img className="desktop-only" src={`${A}/e7365.svg`} alt="" />
        {stopped ? "Start" : "Stop"}
        <span className="sr-only"> {name}</span>
      </DesignButton>
    </div>
  );
}

function Servers({ setView }: { setView: (view: View) => void }) {
  const [region, setRegion] = useState("All regions");
  const [query, setQuery] = useState("");
  const [stopped, setStopped] = useState<string[]>([]);
  const filtered = useMemo(
    () =>
      machines.filter(
        (m) =>
          (region === "All regions" || m.region === region) &&
          (m.name.includes(query.toLowerCase()) || m.ip.includes(query)),
      ),
    [region, query],
  );
  const edit = (name: string) => {
    if (name === "web-prod-01") setView("configuration");
  };
  return (
    <div className="page servers-page">
      <PageHeading
        eyebrow="INFRASTRUCTURE"
        title="Servers"
        description="Every machine. Every detail. All in one place."
        action={<DesignButton className="primary page-action">+&nbsp; Create machine</DesignButton>}
      />
      <section className="server-stats">
        <MetricCard label="Active machines" value="8" detail="All machines are running" trend="" />
        <MetricCard
          label="Deployment regions"
          value="3"
          detail="US East, EU Central, Asia Pacific"
          trend=""
        />
        <MetricCard
          label="Traffic in the last 24 hours"
          value="312.8 GB"
          detail="1.24 TB this billing period"
          trend=""
        />
      </section>
      <section className="card server-inventory">
        <div className="inventory-filters">
          <label className="search">
            <img src={`${A}/ea58c.svg`} alt="" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or IP address"
            />
          </label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
            <option>All regions</option>
            <option>US East</option>
            <option>EU Central</option>
            <option>Asia Pacific</option>
          </select>
          <DesignButton className="outline filter">
            <img src={`${A}/2dca6.svg`} alt="" />
            Filters
          </DesignButton>
          <span>{filtered.length} machines</span>
        </div>
        <div className="server-table-head">
          <span>MACHINE</span>
          <span>STATUS</span>
          <span>PUBLIC IP</span>
          <span>REGION</span>
          <span>TRAFFIC / 24H</span>
          <span>ACTIONS</span>
        </div>
        <div className="server-list">
          {filtered.map((machine) => {
            const isStopped = stopped.includes(machine.name);
            return (
              <article className="server-row" key={machine.name}>
                <div className="server-name">
                  <strong>{machine.name}</strong>
                  <small>{machine.specs}</small>
                </div>
                <span className={`running ${isStopped ? "stopped" : ""}`}>
                  <i />
                  {isStopped ? "Stopped" : "Running"}
                </span>
                <div className="server-ip">
                  <b>PUBLIC IP</b>
                  <span>{machine.ip}</span>
                </div>
                <div className="server-region">
                  <b>REGION</b>
                  <strong>{machine.region}</strong>
                  <small>{machine.city}</small>
                </div>
                <div className="traffic">
                  <span>Traffic / 24h</span>
                  <strong>{machine.traffic.toFixed(1)} GB</strong>
                  <div className="progress">
                    <i style={{ width: `${Math.min(machine.traffic / 0.8, 100)}%` }} />
                  </div>
                </div>
                <ServerActions
                  name={machine.name}
                  stopped={isStopped}
                  onEdit={() => edit(machine.name)}
                  onStop={() =>
                    setStopped((items) =>
                      items.includes(machine.name)
                        ? items.filter((n) => n !== machine.name)
                        : [...items, machine.name],
                    )
                  }
                />
              </article>
            );
          })}
        </div>
        <footer className="inventory-footer">
          <span>
            Showing 1–{filtered.length} of {filtered.length} machines
          </span>
          <span>Rows per page: 10&nbsp;&nbsp; ‹ &nbsp;1&nbsp; ›</span>
        </footer>
      </section>
      <div className="servers-sync">
        <span>●&nbsp; Auto-refresh every 30 seconds</span>
        <span>Last updated just now</span>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [theme, setTheme] = useState<Theme>(() =>
    window.localStorage.getItem("stratus-theme") === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("stratus-theme", theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <Sidebar view={view} setView={setView} />
      <MobileHeader theme={theme} setTheme={setTheme} />
      <main className="workspace">
        <DesktopHeader theme={theme} setTheme={setTheme} />
        {view === "dashboard" && <Dashboard setView={setView} />}
        {view === "configuration" && <Configuration />}
        {view === "servers" && <Servers setView={setView} />}
      </main>
      <Navigation view={view} setView={setView} mobile />
    </div>
  );
}
