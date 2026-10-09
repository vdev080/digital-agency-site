import Homepage from "../models/Homepage.js";
import { homepageDefaults } from "../utils/homepageDefaults.js";

const text = (value, maxLength) => typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength;
const url = (value) => value === "" || (typeof value === "string" && value.length <= 2048);
const ordered = (items, mapper) => Array.isArray(items) ? items.map((item, index) => mapper(item, index)) : [];

function normalizedString(value, maxLength, field) {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string" || value.length > maxLength) {
    const error = new Error(`${field} contains invalid data.`);
    error.statusCode = 422;
    throw error;
  }
  return value.trim();
}

function isLocalOrHttpUrl(value) {
  return value === "" || value.startsWith("/") || /^https?:\/\//i.test(value);
}

export function normalizeWorkItems(items) {
  if (!Array.isArray(items)) return [];

  return items.reduce((normalized, item) => {
    const imageUrl = normalizedString(item?.imageUrl, 2048, "Work image URL");
    const title = normalizedString(item?.title, 160, "Work title");
    const projectUrl = normalizedString(item?.url, 2048, "Work URL");

    // A newly added, untouched editor row is not content and is safely omitted.
    if (!imageUrl && !title && !projectUrl) return normalized;
    if (!imageUrl || !isLocalOrHttpUrl(imageUrl) || !isLocalOrHttpUrl(projectUrl)) {
      const error = new Error("Each work item needs a valid image URL; title and project URL are optional.");
      error.statusCode = 422;
      throw error;
    }

    normalized.push({ imageUrl, title, url: projectUrl, sortOrder: normalized.length });
    return normalized;
  }, []);
}

function homepageResponse(homepage) {
  const content = homepage.toObject();
  return { ...content, work: normalizeWorkItems(content.work) };
}

function normalizeHomepage(body) {
  const banner = body?.banner ?? {};
  const bannerInfo = body?.bannerInfo ?? {};
  if (!text(banner.heading, 500) || !text(banner.description, 2000) || !text(bannerInfo.heading, 2000)) {
    const error = new Error("Banner heading, banner description, and banner info heading are required.");
    error.statusCode = 422;
    throw error;
  }
  const statistics = ordered(banner.statistics, (item, index) => {
    if (!text(item?.value, 60) || !text(item?.label, 160)) throw new Error("Each statistic needs a value and label.");
    return { value: item.value.trim(), label: item.label.trim(), sortOrder: index };
  });
  const topList = ordered(bannerInfo.topList, (item, index) => {
    if (!text(item?.text, 300)) throw new Error("Each top list item needs text.");
    return { text: item.text.trim(), sortOrder: index };
  });
  const services = ordered(bannerInfo.services, (item, index) => {
    if (!text(item?.title, 160) || !url(item?.iconUrl ?? "")) throw new Error("Each service needs a title and valid image URL.");
    return { title: item.title.trim(), iconUrl: (item.iconUrl ?? "").trim(), sortOrder: index };
  });
  const work = normalizeWorkItems(body?.work);
  const founder = bannerInfo.founder ?? {};
  if (!url(founder.imageUrl ?? "") || !url(founder.name ?? "") || !url(founder.title ?? "")) {
    const error = new Error("Founder information contains invalid data."); error.statusCode = 422; throw error;
  }
  return {
    banner: { heading: banner.heading.trim(), description: banner.description.trim(), statistics },
    bannerInfo: { topList, founder: { name: (founder.name ?? "").trim(), title: (founder.title ?? "").trim(), imageUrl: (founder.imageUrl ?? "").trim() }, heading: bannerInfo.heading.trim(), services },
    work,
  };
}

export async function getPublicHomepage(_req, res, next) {
  try {
    const homepage = await Homepage.findOne();
    if (!homepage) return res.status(404).json({ success: false, message: "Homepage content has not been initialized." });
    return res.status(200).json({ success: true, data: { homepage: homepageResponse(homepage) } });
  } catch (error) { next(error); }
}

export async function getAdminHomepage(_req, res, next) {
  try {
    const homepage = await Homepage.findOne();
    return res.status(200).json({ success: true, data: { homepage: homepage ? homepageResponse(homepage) : homepageDefaults, initialized: Boolean(homepage) } });
  } catch (error) { next(error); }
}

export async function updateHomepage(req, res, next) {
  try {
    const content = normalizeHomepage(req.body);
    const homepage = await Homepage.findOneAndUpdate({ singletonKey: "homepage" }, { $set: content, $setOnInsert: { singletonKey: "homepage" } }, { new: true, upsert: true, runValidators: true });
    return res.status(200).json({ success: true, data: { homepage: homepageResponse(homepage) }, message: "Homepage content saved." });
  } catch (error) { if (!error.statusCode) error.statusCode = 422; next(error); }
}
