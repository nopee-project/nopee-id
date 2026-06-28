import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Props={open:boolean;onClose:()=>void};

type SocialLink={
  id:number;
  name:string;
  url:string;
  icon:string;
  sort_order:number;
  is_active:boolean;
};

export default function AdminSettingsModal({open,onClose}:Props){
  const [loading,setLoading]=useState(false);
  const [links,setLinks]=useState<SocialLink[]>([]);

  useEffect(()=>{ if(open) loadLinks(); },[open]);

  async function loadLinks(){
    const {data,error}=await supabase.from("social_links").select("*").order("sort_order");
    if(error){alert(error.message);return;}
    setLinks(data||[]);
  }

  async function saveAll(){
    setLoading(true);
    for(const link of links){
      const {error}=await supabase.from("social_links").update({
        name:link.name,
        url:link.url,
        icon:link.icon,
        sort_order:link.sort_order,
        is_active:link.is_active,
      }).eq("id",link.id);
      if(error){setLoading(false)}
    }
    setLoading(false);
    alert("Semua perubahan disimpan");
    onClose();
  }

  async function addLink(){
    const {error}=await supabase.from("social_links").insert({
      name:"New",
      url:"",
      icon:"",
      sort_order:links.length+1,
      is_active:true
    });
    if(error){alert(error.message);return;}
    loadLinks();
  }

  async function deleteLink(id:number){
    if(!confirm("Hapus link ini?")) return;
    const {error}=await supabase.from("social_links").delete().eq("id",id);
    if(error){alert(error.message);return;}
    loadLinks();
  }

  if(!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Social Links</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <button onClick={addLink} className="mb-6 bg-[#D4B08C] text-black px-4 py-2 rounded">+ Tambah Link</button>

        {links.map((link,index)=>(
          <div key={link.id} className="bg-zinc-800 rounded-lg p-4 mb-4 space-y-3">
            <input className="w-full p-2 rounded bg-zinc-700" value={link.name}
              onChange={e=>{const a=[...links];a[index].name=e.target.value;setLinks(a);}} placeholder="Nama"/>
            <input className="w-full p-2 rounded bg-zinc-700" value={link.url}
              onChange={e=>{const a=[...links];a[index].url=e.target.value;setLinks(a);}} placeholder="URL"/>
            <input className="w-full p-2 rounded bg-zinc-700" value={link.icon}
              onChange={e=>{const a=[...links];a[index].icon=e.target.value;setLinks(a);}} placeholder="Icon"/>
            <div className="flex gap-4 items-center">
              <input type="number" className="w-24 p-2 rounded bg-zinc-700" value={link.sort_order}
                onChange={e=>{const a=[...links];a[index].sort_order=Number(e.target.value);setLinks(a);}}/>
              <label><input type="checkbox" checked={link.is_active}
                onChange={e=>{const a=[...links];a[index].is_active=e.target.checked;setLinks(a);}}/> Active</label>
              <button onClick={()=>deleteLink(link.id)} className="ml-auto bg-red-600 px-3 py-2 rounded">Delete</button>
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="bg-zinc-700 px-4 py-2 rounded">Cancel</button>
          <button disabled={loading} onClick={saveAll} className="bg-[#D4B08C] text-black px-4 py-2 rounded">{loading?"Saving...":"Save All"}</button>
        </div>
      </div>
    </div>
  );
}
