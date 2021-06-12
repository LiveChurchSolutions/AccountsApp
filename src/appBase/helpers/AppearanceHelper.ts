import { ApiHelper } from "./ApiHelper"

export interface AppearanceInterface { primaryColor?: string, primaryContrast?: string, secondaryColor?: string, secondaryContrast?: string, logoLight?: string, logoDark?: string }

export class AppearanceHelper {

  static current: AppearanceInterface;

  public static async load(churchId: string) {
    if (!AppearanceHelper.current) AppearanceHelper.current = await ApiHelper.getAnonymous("/settings/public/" + churchId, "AccessApi");
    return this.current;
  }

  public static getLogoDark(appearanceSettings: AppearanceInterface, defaultLogo: string) {
    return (appearanceSettings?.logoDark) ? appearanceSettings.logoDark : defaultLogo;
  }

  public static getLogoLight(appearanceSettings: AppearanceInterface, defaultLogo: string) {
    return (appearanceSettings?.logoLight) ? appearanceSettings.logoLight : defaultLogo;
  }

}
