import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import classNames from "classnames";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import envParsed from "../envParsed";
import getErrorMessage from "../getErrorMessage";
import { PlacesResult, ReserveResponse } from "../types";

// TODO: extract this schema into a separate package in order to share this with the API preventing duplicate code
const reserveBodySchema = z.object({
  date: z.string().min(1).pipe(z.coerce.date()),
  customersQuantity: z.coerce.number().int().gt(0),
});

type FormType = z.infer<typeof reserveBodySchema>;

function ReserveForm({
  place,
  onClose,
}: {
  place: PlacesResult;
  onClose?: () => void;
}) {
  const tables = place.tables.filter(
    (value, index) => place.tables.indexOf(value) === index
  );

  const [reserveId, setReserveId] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, formState, handleSubmit } = useForm<FormType>({
    resolver: zodResolver(reserveBodySchema),
  });

  const isLoading = formState.isLoading || formState.isSubmitting;

  async function onSave(values: FormType) {
    setServerError(null);

    try {
      const response = await axios.post<ReserveResponse>(
        `${envParsed().APP_URL}/reserves/${place.id}/make`,
        values
      );
      setReserveId(response.data.id);
    } catch (error: unknown) {
      setServerError(getErrorMessage(error));
    }
  }

  return (
    <div className="w-full max-w-4xl px-5 flex flex-col gap-10 items-center">
      {!reserveId && (
        <>
          <h1 className="font-semibold text-2xl md:text-3xl text-center">
            Reserve a table for{" "}
            <span className="text-primary">{place.name}</span>
          </h1>
          <form
            onSubmit={handleSubmit(onSave)}
            className="flex gap-10 w-full flex-col items-center justify-center"
            noValidate
          >
            <div className="flex flex-wrap gap-2 w-full items-center justify-center">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Reserve date</span>
                </div>
                <input
                  {...register("date")}
                  type="date"
                  autoFocus
                  placeholder="Date"
                  disabled={isLoading}
                  className="input input-bordered w-full max-w-xs"
                />
                <div className="label h-10">
                  {formState.errors?.date && (
                    <span className="text-error">
                      {formState.errors.date.message}
                    </span>
                  )}
                </div>
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Table for</span>
                </div>
                <select
                  {...register("customersQuantity")}
                  className="select select-bordered"
                  autoFocus
                  disabled={isLoading}
                >
                  {tables.map((table) => (
                    <option key={`table-for-${table}`} value={table}>
                      {table}
                    </option>
                  ))}
                </select>
                <div className="label h-10">
                  {formState.errors?.customersQuantity && (
                    <span className="label-text text-error">
                      {formState.errors.customersQuantity.message}
                    </span>
                  )}
                </div>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                disabled={isLoading}
                onClick={onClose}
                type="button"
                className="btn btn-neutral min-w-40 transition-all duration-100 active:scale-95"
              >
                <ArrowBackIcon />
                Back to places
              </button>
              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-accent min-w-40 transition-all duration-100 active:scale-95"
              >
                {isLoading && <SpinnerIcon />}
                Reserve
              </button>
            </div>
          </form>

          {serverError && (
            <div role="alert" className="alert max-w-lg">
              <ErrorIcon />
              <span className="text-error">{`Error: ${serverError.toLowerCase()}`}</span>
            </div>
          )}
        </>
      )}
      {reserveId && (
        <>
          <h1 className="font-semibold text-2xl md:text-3xl text-center">
            A table for <span className="text-primary">{place.name}</span> has
            been reserved successfully!!
          </h1>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Your reservation ID is:</div>
              <div className="stat-value">{reserveId}</div>
            </div>
          </div>
          <button
            disabled={isLoading}
            onClick={onClose}
            type="button"
            className="btn btn-neutral min-w-40 transition-all duration-100 active:scale-95"
          >
            <ArrowBackIcon />
            Back to places
          </button>
        </>
      )}
    </div>
  );
}

const SpinnerIcon = ({ className }: { className?: string }) => (
  <svg
    className={classNames("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 3a9 9 0 1 1 0 18a9 9 0 0 1 0 -18z" />
    <path d="M6 12a6 6 0 0 1 6 -6" />
  </svg>
);

const ArrowBackIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M9 14l-4 -4l4 -4" />
    <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
  </svg>
);

const ErrorIcon = ({ className }: { className?: string }) => (
  <svg
    className={classNames("text-error", className)}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M10 10l4 4m0 -4l-4 4" />
  </svg>
);

export default ReserveForm;
