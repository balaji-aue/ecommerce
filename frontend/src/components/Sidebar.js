import React from 'react';

export default function Sidebar({
  search, setSearch,
  category, setCategory,
  categories = [],
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  sort, setSort,
}) {
  // Box-sizing + break rules ensure long text won't overflow and inputs can shrink
  const controlStyle = { width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc', boxSizing: 'border-box' };

  return (
    <div style={{ padding: 12, borderRadius: 8, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', boxSizing: 'border-box' }}>
      <h3 style={{ marginTop: 0 }}>Filters</h3>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...controlStyle }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6, wordBreak: 'break-word' }}>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...controlStyle, whiteSpace: 'normal' }}>
          <option value="">All</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Price</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder="Min" type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ flex: '1 1 48%', minWidth: 0, ...controlStyle }} />
          <input placeholder="Max" type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ flex: '1 1 48%', minWidth: 0, ...controlStyle }} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Sort</label>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...controlStyle }}>
          <option value="">Default</option>
          <option value="price_asc">Price: low to high</option>
          <option value="price_desc">Price: high to low</option>
        </select>
      </div>

      <div>
        <button onClick={() => { setSearch(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setSort(''); }} style={{ width: '100%', padding: 8, borderRadius: 6 }}>Reset</button>
      </div>
    </div>
  );
}
