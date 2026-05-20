"use client";

import { useState, type FormEvent } from "react";

interface SubmitPayload {
  productName: string;
  abv: string;
  source: string;
  price: string;
  description: string;
  submitter: string;
  contact: string;
}

async function submitToApi(payload: SubmitPayload): Promise<void> {
  const res = await fetch("/api/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "제보 전송에 실패했습니다.");
  }
}

export function SubmitForm() {
  const [productName, setProductName] = useState("");
  const [abv, setAbv] = useState("");
  const [source, setSource] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [submitter, setSubmitter] = useState("");
  const [contact, setContact] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File | null) => {
    setImage(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const reset = () => {
    setProductName("");
    setAbv("");
    setSource("");
    setPrice("");
    setDescription("");
    setSubmitter("");
    setContact("");
    handleFile(null);
    setDone(false);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!productName.trim()) {
      setError("제품명은 필수 입력 항목입니다.");
      return;
    }
    setSubmitting(true);
    try {
      await submitToApi({
        productName,
        abv,
        source,
        price,
        description,
        submitter,
        contact,
      });
      setDone(true);
    } catch {
      setError("제보 전송 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-card">
        <h3 className="font-serif text-xl font-semibold text-emerald-900">
          제보 감사합니다! 🎉
        </h3>
        <p className="mt-2 text-sm text-emerald-900/80">
          소중한 정보 잘 받았습니다. 검수 후 데이터에 반영될 예정입니다.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-50 hover:bg-emerald-800"
        >
          다른 제보 작성하기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-cream-200 bg-cream-50 p-5 shadow-card sm:p-6"
    >
      <Field label="제품명" required>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="예: 우령정 38도"
          className="form-input"
          required
        />
      </Field>

      <Field label="사진 업로드">
        <input
          id="submit-image"
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm file:mr-3 file:rounded-full file:border-0 file:bg-navy-800 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-cream-50 hover:file:bg-navy-900"
        />
        {imagePreview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagePreview}
            alt="제보 이미지 미리보기"
            className="mt-3 max-h-56 rounded-xl border border-cream-200"
          />
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="도수">
          <input
            type="text"
            value={abv}
            onChange={(e) => setAbv(e.target.value)}
            placeholder="예: 38%"
            className="form-input"
          />
        </Field>
        <Field label="가격">
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="예: 25,000원"
            className="form-input"
          />
        </Field>
      </div>

      <Field label="구입처 또는 본 장소">
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="예: 서울 종로 양꼬치 가게"
          className="form-input"
        />
      </Field>

      <Field label="간단한 설명">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="제품의 인상, 향, 도수 느낌 등을 자유롭게 적어주세요."
          className="form-input resize-y"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="제보자 이름 또는 닉네임">
          <input
            type="text"
            value={submitter}
            onChange={(e) => setSubmitter(e.target.value)}
            placeholder="예: 백주러버"
            className="form-input"
          />
        </Field>
        <Field label="연락처 또는 이메일 (선택)">
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="추가 확인용. 비워두셔도 됩니다."
            className="form-input"
          />
        </Field>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-navy-700/70">
          제보된 정보는 검수 후 사이트에 반영됩니다.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-navy-800 px-6 py-2.5 text-sm font-semibold text-cream-50 transition hover:bg-navy-900 disabled:opacity-60"
        >
          {submitting ? "전송 중..." : "제보 보내기"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-navy-900">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
