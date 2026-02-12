"use client"
export function getTicketId(key: string) {
  let id = localStorage.getItem(key);
  if (!id) {
    id = (Math.floor(100000 + Math.random() * 900000)).toString();
    localStorage.setItem(key, id);
  }
  return id;
}
